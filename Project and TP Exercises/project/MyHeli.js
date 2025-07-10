import { CGFobject } from '../lib/CGF.js';
import { HeliHead } from './helicopter/head.js';
import { HeliTail } from './helicopter/tail.js';
import { HeliUpperPropeller } from './helicopter/upper_propeller.js';
import { HeliLowerPropeller } from './helicopter/lower_propeller.js';
import { HeliLandingGear } from './helicopter/landing_gear.js';
import { HeliHangingBucket } from './helicopter/haging_bucket.js';
import { lights } from './helicopter/lights.js'; // Import the lights class


export class MyHeli extends CGFobject {
    constructor(scene, textureHandler, lake, building, forest) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        this.lake = lake;
        this.building = building;
        this.forest = forest;
        
        this.position = { 
            x: building ? building.position?.x || 20 : 20, 
            y: building ? (building.position?.y || 0) + 42.5 : 42.5, 
            z: building ? building.position?.z || -20 : -20 
        }; 
        
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotationY = 0; 
        this.rotationX = 0; 

        // Parameters for tilt animation
        this.maxTilt = Math.PI / 40; 
        this.tiltAcceleration = 0.2; 
        this.targetRotationX = 0; 
        
        // Flight parameters 
        this.cruiseAltitude = 50;
        this.heloportAltitude = this.position.y; 
        this.lakeAltitude = this.lake ? this.lake.position.y : 0.1;
        this.isFlying = false;
        this.propellersActive = false; 
        this.bucket_deploy = false;
        this.targetAltitude = this.cruiseAltitude;
        this.verticalSpeed = 5.0; 
        
        this.heliportState = 'idle';
        this.initComponents();
    }
    
    initComponents() {
        // Create all helicopter components
        this.head = new HeliHead(this.scene, this.textureHandler);
        this.tail = new HeliTail(this.scene, this.textureHandler);
        this.upperPropeller = new HeliUpperPropeller(this.scene, this.textureHandler);
        this.lowerPropeller = new HeliLowerPropeller(this.scene, this.textureHandler);
        this.landingGear = new HeliLandingGear(this.scene, this.textureHandler);
        this.bucket = new HeliHangingBucket(this.scene, this.textureHandler);
        this.lights = new lights(this.scene, this.textureHandler); 
    } 
    
    update(elapsedTime) {
        const deltaTime = elapsedTime / 1000; // Convert to seconds

        if (this.propellersActive) {
            this.upperPropeller.update(elapsedTime);
            this.lowerPropeller.update(elapsedTime);
        }

        // Update bucket animations
        if (this.bucket) {
            this.bucket.update(deltaTime);

            // Handle bucket deployment/retraction based on bucket_deploy state
            if (this.bucket_deploy && !this.bucket.isDeploying && this.bucket.deployProgress < 1) {
                this.bucket.startDeployment();
            } else if (!this.bucket_deploy && !this.bucket.isRetracting && this.bucket.deployProgress > 0) {
                this.bucket.startRetraction();
            }
        }

        if (this.heliportState === 'auto_landing' && this.targetDestination) {
            // Calculate direction vector to heliport
            const dx = this.targetDestination.x - this.position.x;
            const dz = this.targetDestination.z - this.position.z;
            const distance = Math.sqrt(dx*dx + dz*dz);

            // If we're not yet at the heliport 
            if (distance > 1.0) {
                // Calculate normalized direction
                const normalizedDx = dx / distance;
                const normalizedDz = dz / distance;

                // Set velocity based on direction with reduced speed for precision
                const moveSpeed = Math.min(this.verticalSpeed * 0.8, distance * 2); 
                this.velocity.x = normalizedDx * moveSpeed;
                this.velocity.z = normalizedDz * moveSpeed;

                // Gradually turn towards target
                const targetRotation = Math.atan2(normalizedDx, normalizedDz);

                // Handle rotation with smoother turning
                let rotDiff = targetRotation - this.rotationY;
                while (rotDiff > Math.PI) rotDiff -= 2 * Math.PI;
                while (rotDiff < -Math.PI) rotDiff += 2 * Math.PI;

                const turnSpeed = Math.min(0.03, Math.abs(rotDiff) * 0.5);
                if (Math.abs(rotDiff) > 0.01) {
                    this.rotationY += Math.sign(rotDiff) * turnSpeed;
                }

                this.targetRotationX = -this.maxTilt * 0.5;
                this.lights.mode = 'forward';
            } else {
                // We've reached the heliport position, stop horizontal movement
                this.velocity.x = 0;
                this.velocity.z = 0;
                this.targetRotationX = 0;
                this.lights.mode = 'idle';

                // Snap to exact position to ensure precision
                this.position.x = this.targetDestination.x;
                this.position.z = this.targetDestination.z;

                // Calculate rotation difference to 0 (default position)
                let rotDiff = 0 - this.rotationY;

                // Normalize rotation difference to [-PI, PI]
                while (rotDiff > Math.PI){
                    rotDiff -= 2 * Math.PI;
                } 

                while (rotDiff < -Math.PI){
                    rotDiff += 2 * Math.PI;
                } 

                // If helicopter is not yet at default rotation, keep rotating
                if (Math.abs(rotDiff) > 0.01) {
                    const turnSpeed = Math.min(0.03, Math.abs(rotDiff) * 0.5);
                    this.rotationY += Math.sign(rotDiff) * turnSpeed;
                    this.targetAltitude = this.position.y;
                } else {
                    // Rotation complete, snap to exact rotation and begin vertical landing
                    this.rotationY = 0; 
                    this.heliportState = 'landing';
                    this.bucket_deploy = false;
                    this.targetAltitude = this.heloportAltitude;
                    this.velocity.y = -this.verticalSpeed;
                }
            }
        }

        // Update position based on velocity
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;

        // Gradual tilt animation towards target tilt
        if (this.rotationX < this.targetRotationX) {
            this.rotationX = Math.min(this.targetRotationX,
                this.rotationX + this.tiltAcceleration * deltaTime);
        } else if (this.rotationX > this.targetRotationX) {
            this.rotationX = Math.max(this.targetRotationX,
                this.rotationX - this.tiltAcceleration * deltaTime);
        }

        // Check if helicopter has reached the target altitude
        if (this.velocity.y !== 0) {
            const reachedTarget = (this.velocity.y > 0 && this.position.y >= this.targetAltitude) ||
                                  (this.velocity.y < 0 && this.position.y <= this.targetAltitude);

            if (reachedTarget) {
                this.position.y = this.targetAltitude; 
                this.velocity.y = 0; 

                // Check state transitions after reaching altitude
                if (this.heliportState === 'taking_off' && Math.abs(this.position.y - this.cruiseAltitude) < 0.1) {
                    this.heliportState = 'idle'; // Finished taking off
                    this.bucket_deploy = true; // Deploy bucket after reaching cruise altitude
                } else if (this.heliportState === 'landing' && Math.abs(this.position.y - this.heloportAltitude) < 0.1) {
                    this.heliportState = 'idle'; // Finished landing
                    this.isFlying = false;
                    this.propellersActive = false;
                    // Ensure exact position when landed
                    this.position.x = this.building ? this.building.position?.x || 20 : 20;
                    this.position.z = this.building ? this.building.position?.z || -20 : -20;
                    this.rotationY = 0;
                    if (this.bucket.haswater) {
                        this.bucket.haswater = false;
                    }
                } else if (Math.abs(this.position.y - (this.lakeAltitude + 6)) < 0.1) {
                    if (this.isOverLake()) {
                        this.bucket.haswater = true;
                    }
                }
            }
        }

        // Update lights component
        this.lights.pulsating = this.isFlying; 
        this.lights.update(elapsedTime);
    }

    isOverLake() {
        if (!this.lake) return false;
        
        const dx = this.position.x - this.lake.position.x;
        const dz = this.position.z - this.lake.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        
        const lakeRadius = this.lake.size / 2;
        return distance < lakeRadius;
    }

    isOverBuilding() {
        if (!this.building) return false;
        
        const buildingX = this.building instanceof Object && this.building.position ? 
            this.building.position.x : 20;
        const buildingZ = this.building instanceof Object && this.building.position ? 
            this.building.position.z : -20;
        
        const dx = this.position.x - buildingX;
        const dz = this.position.z - buildingZ;
        const distance = Math.sqrt(dx*dx + dz*dz);
        const helipadRadius = 4.5; 
        
        return distance < helipadRadius;
    }
    
    isOverForest() {
        if (!this.forest) {
            return false;
        }
        
        // Forest boundaries, calculated for forest in  (-35, 0, -55) 
        const forestBounds = {
            minX: -55,  
            maxX: -13,  
            minZ: -75,  
            maxZ: -33   
        };
        
        // Helicopter is within forest boundaries
        const isOverForest = (
            this.position.x >= forestBounds.minX && 
            this.position.x <= forestBounds.maxX &&
            this.position.z >= forestBounds.minZ && 
            this.position.z <= forestBounds.maxZ
        );
        
        return isOverForest;
    }
    
    dropWater() {
        // Helicopter has water and is over the forest        
        if (!this.forest) {
            return false;
        }
        
        const heliState = {
            hasWater: this.bucket?.haswater || false,
            isOverForest: this.isOverForest(),
            isFlying: this.isFlying,
        };
        
        // Start the drop animation if the helicopter is flying, has water, and is over the forest
        if (this.bucket && heliState.hasWater && heliState.isOverForest && this.isFlying) {
            // Start drop animation and return immediately
            if (this.bucket.startDropAnimation()) {
                // Extinguish fires after the animation is near completion
                setTimeout(() => {
                    if (this.forest) {
                        this.forest.extinguishAllFires();
                    }
                }, this.bucket.dropDuration * 800); 
                
                return true;
            }
        }
        return false;
    }
    
    accelerate(speed) {
        if (!this.isFlying) return;
        
        this.velocity.x = Math.sin(this.rotationY) * speed;
        this.velocity.z = Math.cos(this.rotationY) * speed;
        
        if (speed > 0) {
            this.targetRotationX = -this.maxTilt;
            this.lights.mode = 'forward'; 
        } else if (speed < 0) {
            this.targetRotationX = this.maxTilt;
            this.lights.mode = 'backward'; 
        } else {
            this.targetRotationX = 0;
            this.lights.mode = 'idle'; 
        }
    }
    
    turn(angle) {
        if (!this.isFlying) return;
        
        this.rotationY += angle;
        this.rotationY = this.rotationY % (2 * Math.PI);
    }

    stopMovement() {
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.targetRotationX = 0; 
        this.lights.mode = 'idle'; 
    }

    reset() {
        // Reset to initial position and state
        this.position.x = this.building ? this.building.position?.x || 20 : 20;
        this.position.y = this.heloportAltitude;
        this.position.z = this.building ? this.building.position?.z || -20 : -20;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.z = 0;
        this.rotationX = 0;
        this.targetRotationX = 0;
        this.isFlying = false;
        this.propellersActive = false;
        this.bucket_deploy = false;
        this.heliportState = 'idle'; // Reset state
        if (this.bucket && this.bucket.haswater) {
            this.bucket.haswater = false;
        }
    }

    fly() {
        // Check if currently at heliport altitude and not already flying
        if (Math.abs(this.position.y - this.heloportAltitude) < 0.1 && !this.isFlying) {
             this.heliportState = 'taking_off';
        } 
        // Initiate ascent if below cruise altitude
        if (this.position.y < this.cruiseAltitude) {
            this.isFlying = true;
            this.propellersActive = true;
            this.velocity.y = this.verticalSpeed;
            this.targetAltitude = this.cruiseAltitude;
        }
    }
       
    landing() {
        if (!this.isFlying) return;

        // Check if bucket is empty
        const bucketEmpty = this.bucket && !this.bucket.haswater;

        // Land on heliport if we're above it
        if (this.isOverBuilding()) {
            this.bucket_deploy = false;
            if (this.bucket && this.bucket.haswater) {
                this.bucket.haswater = false;
            }

            // Check if the helicopter is already landing
            if (this.heliportState !== 'landing') {
                this.heliportState = 'landing';     
                this.targetAltitude = this.heloportAltitude;

                if (this.position.y > this.targetAltitude) {
                    this.velocity.y = -this.verticalSpeed;
                } else if (this.position.y < this.targetAltitude) {
                    this.velocity.y = this.verticalSpeed;
                }
            }
        }
        // Land at lake if we're above it and bucket is empty
        else if (this.isOverLake() && bucketEmpty) {
            this.bucket_deploy = true;
            this.heliportState = 'idle'; // Reinforcing state to idle
            this.targetAltitude = this.lake ? this.lake.position.y + 6 : this.lakeAltitude + 6;

            if (this.position.y > this.targetAltitude) {
                this.velocity.y = -this.verticalSpeed;
            } 
            else if (this.position.y < this.targetAltitude) {
                this.velocity.y = this.verticalSpeed;
            }
        }
        // Always return to heliport when L is pressed (regardless of bucket state)
        else {
            this.heliportState = 'auto_landing';
            this.stopMovement(); 
            // Get exact heliport position (where helicopter started)
            this.targetDestination = {
                x: this.building ? this.building.position?.x || 20 : 20,
                z: this.building ? this.building.position?.z || -20 : -20
            };
            // Empty bucket if it has water when returning to heliport
            if (this.bucket && this.bucket.haswater) {
                this.bucket.haswater = false;
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        
        // Position the helicopter
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(Math.PI * 3 / 2, 0, 1, 0); 
        this.scene.rotate(this.rotationY, 0, 1, 0); 
        this.scene.rotate(this.rotationX, 0, 0, 1); 
        this.scene.scale(1.0, 1.0, 1.0); 
        
        // Draw the head 
        this.head.display();
        
        // Draw the tail section 
        this.tail.display();
        
        // Draw the main (upper) propeller 
        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, 0); 
        this.upperPropeller.display();
        this.scene.popMatrix();
        
        // Draw the tail (lower) propeller
        this.scene.pushMatrix();
        this.scene.translate(-6.5, 0.7, 0.6); 
        this.lowerPropeller.display();
        this.scene.popMatrix();
        
        // landing gear 
        this.landingGear.display();
        
        // Draw the hanging bucket
        if(this.bucket_deploy || this.bucket.deployProgress > 0){
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0.2);
            this.bucket.display();
            this.scene.popMatrix();
        }
        // Draw the lights
        this.lights.display(); 
        this.scene.popMatrix();
    }
}