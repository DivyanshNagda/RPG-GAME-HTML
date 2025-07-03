// CyberStrike RPG Shooter - Complete Game Engine
// Features: Three.js rendering, Ammo.js physics, RPG mechanics, AI enemies

class CyberStrikeGame {
    constructor() {
        this.isInitialized = false;
        this.isGameRunning = false;
        this.gameState = 'loading'; // loading, menu, playing, paused
        
        // Core systems
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.physics = null;
        this.audioListener = null;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.destructibles = [];
        this.pickups = [];
        
        // Controls
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false,
            crouch: false,
            shoot: false,
            reload: false
        };
        
        this.mouse = {
            x: 0,
            y: 0,
            sensitivity: 1.0,
            locked: false
        };
        
        // Game settings
        this.settings = {
            graphics: 'medium',
            resolution: '1920x1080',
            masterVolume: 0.7,
            sfxVolume: 0.8,
            mouseSensitivity: 1.0
        };
        
        // Tutorial system
        this.tutorial = {
            active: false,
            step: 0,
            steps: [
                {
                    title: "Welcome to CyberStrike!",
                    text: "Use WASD to move, mouse to look around, and left click to shoot."
                },
                {
                    title: "Advanced Movement",
                    text: "Hold Shift to sprint, Space to jump, and C to crouch. Use cover wisely!"
                },
                {
                    title: "Combat System",
                    text: "Right click to aim, R to reload. Different weapons have unique properties."
                },
                {
                    title: "RPG Elements",
                    text: "Gain XP by defeating enemies. Level up to unlock new abilities and weapons."
                },
                {
                    title: "Environment",
                    text: "Objects can be destroyed for cover or resources. Explore thoroughly!"
                }
            ]
        };
        
        this.loadingProgress = 0;
        this.init();
    }
    
    async init() {
        try {
            await this.initPhysics();
            this.initGraphics();
            this.initAudio();
            this.initControls();
            this.initUI();
            this.loadAssets();
            
            this.isInitialized = true;
            this.showMainMenu();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh and try again.');
        }
    }
    
    async initPhysics() {
        this.updateLoadingProgress(10, "Loading Physics Engine...");
        
        return new Promise((resolve) => {
            Ammo().then((AmmoLib) => {
                this.Ammo = AmmoLib;
                
                // Create physics world
                const collisionConfiguration = new AmmoLib.btDefaultCollisionConfiguration();
                const dispatcher = new AmmoLib.btCollisionDispatcher(collisionConfiguration);
                const overlappingPairCache = new AmmoLib.btDbvtBroadphase();
                const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
                
                this.physics = new AmmoLib.btDiscreteDynamicsWorld(
                    dispatcher, overlappingPairCache, solver, collisionConfiguration
                );
                
                this.physics.setGravity(new AmmoLib.btVector3(0, -9.82, 0));
                
                this.updateLoadingProgress(30, "Physics Engine Ready!");
                resolve();
            });
        });
    }
    
    initGraphics() {
        this.updateLoadingProgress(40, "Initializing Graphics...");
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000033, 50, 500);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        
        // Create renderer
        const canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: this.settings.graphics !== 'low',
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = this.settings.graphics !== 'low';
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Create lighting
        this.initLighting();
        
        this.updateLoadingProgress(60, "Graphics System Ready!");
    }
    
    initLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Atmospheric lighting
        const hemiLight = new THREE.HemisphereLight(0x0080ff, 0x080820, 0.5);
        this.scene.add(hemiLight);
        
        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0x00ffff, 2, 50);
        pointLight1.position.set(20, 10, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff4400, 1.5, 40);
        pointLight2.position.set(-20, 15, -20);
        this.scene.add(pointLight2);
    }
    
    initAudio() {
        this.updateLoadingProgress(70, "Loading Audio System...");
        
        this.audioListener = new THREE.AudioListener();
        this.camera.add(this.audioListener);
        
        // Audio loader
        this.audioLoader = new THREE.AudioLoader();
        
        // Create audio objects
        this.sounds = {
            shoot: null,
            reload: null,
            explosion: null,
            footstep: null,
            enemyHit: null,
            levelUp: null,
            pickup: null,
            ambient: null
        };
        
        // For now, create placeholder sounds using Web Audio API
        this.createPlaceholderSounds();
    }
    
    createPlaceholderSounds() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Simple sound generation for placeholder
        this.generateSound = (frequency, duration, type = 'square') => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }
    
    initControls() {
        this.updateLoadingProgress(80, "Setting up Controls...");
        
        // Keyboard controls
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Mouse controls
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('mousedown', (event) => this.onMouseDown(event));
        document.addEventListener('mouseup', (event) => this.onMouseUp(event));
        document.addEventListener('wheel', (event) => this.onMouseWheel(event));
        
        // Pointer lock
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        
        // Prevent context menu
        document.addEventListener('contextmenu', (event) => event.preventDefault());
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    initUI() {
        this.updateLoadingProgress(90, "Preparing User Interface...");
        
        // Main menu buttons
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('load-game').addEventListener('click', () => this.loadGame());
        document.getElementById('settings').addEventListener('click', () => this.showSettings());
        document.getElementById('tutorial').addEventListener('click', () => this.startTutorial());
        
        // Pause menu buttons
        document.getElementById('resume-game').addEventListener('click', () => this.resumeGame());
        document.getElementById('save-game').addEventListener('click', () => this.saveGame());
        document.getElementById('load-pause').addEventListener('click', () => this.loadGame());
        document.getElementById('settings-pause').addEventListener('click', () => this.showSettings());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.showMainMenu());
        
        // Settings
        document.getElementById('close-settings').addEventListener('click', () => this.closeSettings());
        document.getElementById('graphics-quality').addEventListener('change', (e) => {
            this.settings.graphics = e.target.value;
            this.applyGraphicsSettings();
        });
        
        // Tutorial
        document.getElementById('tutorial-next').addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('tutorial-prev').addEventListener('click', () => this.prevTutorialStep());
        document.getElementById('tutorial-skip').addEventListener('click', () => this.skipTutorial());
        
        // Hotbar
        document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
            slot.addEventListener('click', () => this.selectWeapon(index));
        });
        
        // ESC key for pause
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && this.gameState === 'playing') {
                this.pauseGame();
            }
        });
    }
    
    loadAssets() {
        this.updateLoadingProgress(95, "Loading Game Assets...");
        
        // Create environment
        this.createEnvironment();
        
        // Create player
        this.createPlayer();
        
        // Create enemies
        this.createEnemies();
        
        // Create physics objects
        this.createPhysicsObjects();
        
        this.updateLoadingProgress(100, "Ready to Play!");
        
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            this.showMainMenu();
        }, 500);
    }
    
    createEnvironment() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create ground physics
        const groundShape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(100, 0.5, 100));
        const groundTransform = new this.Ammo.btTransform();
        groundTransform.setIdentity();
        groundTransform.setOrigin(new this.Ammo.btVector3(0, -0.5, 0));
        
        const groundMass = 0;
        const groundLocalInertia = new this.Ammo.btVector3(0, 0, 0);
        const groundMotionState = new this.Ammo.btDefaultMotionState(groundTransform);
        const groundRbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            groundMass, groundMotionState, groundShape, groundLocalInertia
        );
        const groundBody = new this.Ammo.btRigidBody(groundRbInfo);
        this.physics.addRigidBody(groundBody);
        
        // Futuristic city buildings
        this.createBuildings();
        
        // Atmospheric particles
        this.createParticles();
        
        // Skybox
        this.createSkybox();
    }
    
    createBuildings() {
        const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x444444, emissive: 0x001122 }),
            new THREE.MeshPhongMaterial({ color: 0x555555, emissive: 0x002211 }),
            new THREE.MeshPhongMaterial({ color: 0x333333, emissive: 0x110022 })
        ];
        
        for (let i = 0; i < 20; i++) {
            const building = new THREE.Mesh(
                buildingGeometry.clone(),
                materials[Math.floor(Math.random() * materials.length)]
            );
            
            const width = 5 + Math.random() * 10;
            const height = 10 + Math.random() * 30;
            const depth = 5 + Math.random() * 10;
            
            building.scale.set(width, height, depth);
            building.position.set(
                (Math.random() - 0.5) * 180,
                height / 2,
                (Math.random() - 0.5) * 180
            );
            
            building.castShadow = true;
            building.receiveShadow = true;
            this.scene.add(building);
            
            // Add building to physics
            this.addBuildingPhysics(building, width, height, depth);
        }
    }
    
    addBuildingPhysics(building, width, height, depth) {
        const shape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(width/2, height/2, depth/2));
        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(
            building.position.x,
            building.position.y,
            building.position.z
        ));
        
        const mass = 0; // Static object
        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        const motionState = new this.Ammo.btDefaultMotionState(transform);
        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            mass, motionState, shape, localInertia
        );
        const body = new this.Ammo.btRigidBody(rbInfo);
        this.physics.addRigidBody(body);
    }
    
    createParticles() {
        // Atmospheric dust particles
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.5,
            transparent: true,
            opacity: 0.3
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        this.particleSystem = particleSystem;
    }
    
    createSkybox() {
        const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            color: 0x000033,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);
    }
    
    createPlayer() {
        this.player = {
            // Visual representation
            mesh: null,
            
            // Physics
            body: null,
            
            // Stats
            health: 100,
            maxHealth: 100,
            level: 1,
            xp: 0,
            xpToNext: 100,
            
            // Position and movement
            position: new THREE.Vector3(0, 5, 0),
            velocity: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            
            // Movement properties
            walkSpeed: 5,
            runSpeed: 8,
            jumpPower: 6,
            
            // Camera
            camera: this.camera,
            cameraOffset: new THREE.Vector3(0, 1.8, 0),
            
            // Weapons
            currentWeapon: 0,
            weapons: [
                {
                    name: "PLASMA RIFLE",
                    damage: 25,
                    fireRate: 600, // rounds per minute
                    maxAmmo: 30,
                    totalAmmo: 120,
                    currentAmmo: 30,
                    reloadTime: 2000,
                    lastFired: 0,
                    reloading: false
                },
                {
                    name: "GRENADE LAUNCHER",
                    damage: 80,
                    fireRate: 60,
                    maxAmmo: 6,
                    totalAmmo: 24,
                    currentAmmo: 6,
                    reloadTime: 3000,
                    lastFired: 0,
                    reloading: false
                }
            ],
            
            // State
            isOnGround: false,
            isMoving: false,
            isSprinting: false,
            isCrouching: false
        };
        
        // Create player visual
        const playerGeometry = new THREE.CapsuleGeometry(0.5, 1.8, 4, 8);
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        this.player.mesh = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.mesh.position.copy(this.player.position);
        this.player.mesh.visible = false; // Third person view, so hide player mesh
        this.scene.add(this.player.mesh);
        
        // Create player physics
        this.createPlayerPhysics();
        
        // Set camera position
        this.updateCameraPosition();
    }
    
    createPlayerPhysics() {
        const shape = new this.Ammo.btCapsuleShape(0.5, 1.8);
        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(
            this.player.position.x,
            this.player.position.y,
            this.player.position.z
        ));
        
        const mass = 1;
        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        
        const motionState = new this.Ammo.btDefaultMotionState(transform);
        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            mass, motionState, shape, localInertia
        );
        
        this.player.body = new this.Ammo.btRigidBody(rbInfo);
        this.player.body.setAngularFactor(new this.Ammo.btVector3(0, 1, 0)); // Prevent rotation on X and Z
        this.player.body.setActivationState(4); // Disable deactivation
        
        this.physics.addRigidBody(this.player.body);
    }
    
    createEnemies() {
        const enemyTypes = [
            {
                name: "Drone",
                health: 50,
                speed: 3,
                damage: 15,
                attackRange: 20,
                color: 0xff4400,
                size: 1
            },
            {
                name: "Robot",
                health: 100,
                speed: 2,
                damage: 30,
                attackRange: 15,
                color: 0x8800ff,
                size: 1.5
            },
            {
                name: "Cyborg",
                health: 150,
                speed: 4,
                damage: 20,
                attackRange: 25,
                color: 0x00ff88,
                size: 1.2
            }
        ];
        
        for (let i = 0; i < 10; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.createEnemy(type, i);
        }
    }
    
    createEnemy(type, id) {
        const enemy = {
            id: id,
            type: type.name,
            health: type.health,
            maxHealth: type.health,
            speed: type.speed,
            damage: type.damage,
            attackRange: type.attackRange,
            
            // Position
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 100,
                5,
                (Math.random() - 0.5) * 100
            ),
            
            // AI state
            state: 'patrol', // patrol, chase, attack, dead
            target: null,
            lastAttack: 0,
            attackCooldown: 1000,
            patrolTarget: new THREE.Vector3(),
            
            // Visual and physics
            mesh: null,
            body: null
        };
        
        // Create enemy visual
        const enemyGeometry = new THREE.BoxGeometry(type.size, type.size, type.size);
        const enemyMaterial = new THREE.MeshPhongMaterial({ 
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.2
        });
        enemy.mesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.mesh.position.copy(enemy.position);
        enemy.mesh.castShadow = true;
        this.scene.add(enemy.mesh);
        
        // Create enemy physics
        this.createEnemyPhysics(enemy, type.size);
        
        // Set initial patrol target
        this.setNewPatrolTarget(enemy);
        
        this.enemies.push(enemy);
    }
    
    createEnemyPhysics(enemy, size) {
        const shape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(size/2, size/2, size/2));
        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(
            enemy.position.x,
            enemy.position.y,
            enemy.position.z
        ));
        
        const mass = 1;
        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        
        const motionState = new this.Ammo.btDefaultMotionState(transform);
        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            mass, motionState, shape, localInertia
        );
        
        enemy.body = new this.Ammo.btRigidBody(rbInfo);
        enemy.body.setAngularFactor(new this.Ammo.btVector3(0, 1, 0));
        
        this.physics.addRigidBody(enemy.body);
    }
    
    createPhysicsObjects() {
        // Create destructible crates
        for (let i = 0; i < 15; i++) {
            this.createDestructibleCrate();
        }
        
        // Create pickups
        for (let i = 0; i < 8; i++) {
            this.createPickup();
        }
    }
    
    createDestructibleCrate() {
        const crate = {
            health: 50,
            mesh: null,
            body: null,
            destroyed: false
        };
        
        // Visual
        const crateGeometry = new THREE.BoxGeometry(2, 2, 2);
        const crateMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            map: this.createCrateTexture()
        });
        crate.mesh = new THREE.Mesh(crateGeometry, crateMaterial);
        crate.mesh.position.set(
            (Math.random() - 0.5) * 80,
            1,
            (Math.random() - 0.5) * 80
        );
        crate.mesh.castShadow = true;
        crate.mesh.receiveShadow = true;
        this.scene.add(crate.mesh);
        
        // Physics
        const shape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(1, 1, 1));
        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(
            crate.mesh.position.x,
            crate.mesh.position.y,
            crate.mesh.position.z
        ));
        
        const mass = 10;
        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        
        const motionState = new this.Ammo.btDefaultMotionState(transform);
        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            mass, motionState, shape, localInertia
        );
        
        crate.body = new this.Ammo.btRigidBody(rbInfo);
        this.physics.addRigidBody(crate.body);
        
        this.destructibles.push(crate);
    }
    
    createCrateTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Create wood texture
        context.fillStyle = '#8B4513';
        context.fillRect(0, 0, 64, 64);
        
        context.fillStyle = '#A0522D';
        for (let i = 0; i < 64; i += 8) {
            context.fillRect(i, 0, 4, 64);
            context.fillRect(0, i, 64, 4);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    createPickup() {
        const pickupTypes = [
            { type: 'ammo', color: 0x00ff00, effect: () => this.addAmmo() },
            { type: 'health', color: 0xff0000, effect: () => this.addHealth() },
            { type: 'xp', color: 0x0000ff, effect: () => this.addXP() }
        ];
        
        const pickupType = pickupTypes[Math.floor(Math.random() * pickupTypes.length)];
        
        const pickup = {
            type: pickupType.type,
            effect: pickupType.effect,
            mesh: null,
            collected: false
        };
        
        // Visual
        const pickupGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const pickupMaterial = new THREE.MeshPhongMaterial({ 
            color: pickupType.color,
            emissive: pickupType.color,
            emissiveIntensity: 0.3
        });
        pickup.mesh = new THREE.Mesh(pickupGeometry, pickupMaterial);
        pickup.mesh.position.set(
            (Math.random() - 0.5) * 90,
            2,
            (Math.random() - 0.5) * 90
        );
        this.scene.add(pickup.mesh);
        
        this.pickups.push(pickup);
    }
    
    // Game Loop
    gameLoop() {
        if (!this.isGameRunning) return;
        
        const deltaTime = 1/60; // Assuming 60 FPS
        
        this.updatePhysics(deltaTime);
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateProjectiles(deltaTime);
        this.updatePickups(deltaTime);
        this.updateParticles(deltaTime);
        this.updateUI();
        
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updatePhysics(deltaTime) {
        if (this.physics) {
            this.physics.stepSimulation(deltaTime, 10);
        }
    }
    
    updatePlayer(deltaTime) {
        if (!this.player || !this.player.body) return;
        
        // Update player movement
        this.handlePlayerMovement(deltaTime);
        
        // Update player position from physics
        const ms = this.player.body.getMotionState();
        if (ms) {
            const transform = new this.Ammo.btTransform();
            ms.getWorldTransform(transform);
            const origin = transform.getOrigin();
            
            this.player.position.set(origin.x(), origin.y(), origin.z());
            this.player.mesh.position.copy(this.player.position);
        }
        
        // Update camera
        this.updateCameraPosition();
        
        // Update weapon
        this.updateWeapon(deltaTime);
    }
    
    handlePlayerMovement(deltaTime) {
        const velocity = this.player.body.getLinearVelocity();
        const currentVel = new THREE.Vector3(velocity.x(), velocity.y(), velocity.z());
        
        let moveX = 0;
        let moveZ = 0;
        
        if (this.controls.forward) moveZ -= 1;
        if (this.controls.backward) moveZ += 1;
        if (this.controls.left) moveX -= 1;
        if (this.controls.right) moveX += 1;
        
        // Normalize movement
        if (moveX !== 0 || moveZ !== 0) {
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
        }
        
        // Apply camera rotation to movement
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const right = new THREE.Vector3().crossVectors(cameraDirection, this.camera.up).normalize();
        const forward = new THREE.Vector3().crossVectors(this.camera.up, right).normalize();
        
        const moveDirection = new THREE.Vector3();
        moveDirection.addScaledVector(right, moveX);
        moveDirection.addScaledVector(forward, moveZ);
        
        // Apply speed
        const speed = this.controls.sprint ? this.player.runSpeed : this.player.walkSpeed;
        moveDirection.multiplyScalar(speed);
        
        // Apply movement
        this.player.body.setLinearVelocity(new this.Ammo.btVector3(
            moveDirection.x,
            currentVel.y, // Keep Y velocity for gravity/jumping
            moveDirection.z
        ));
        
        // Jumping
        if (this.controls.jump && this.player.isOnGround) {
            this.player.body.setLinearVelocity(new this.Ammo.btVector3(
                moveDirection.x,
                this.player.jumpPower,
                moveDirection.z
            ));
            this.player.isOnGround = false;
        }
        
        // Check if on ground (simplified)
        this.player.isOnGround = Math.abs(currentVel.y) < 0.1 && this.player.position.y < 6;
    }
    
    updateCameraPosition() {
        // Third-person camera
        const distance = 5;
        const height = 2;
        
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(this.player.position);
        cameraPosition.y += height;
        
        // Add offset based on mouse look
        const spherical = new THREE.Spherical(distance, Math.PI/2 - this.mouse.y * 0.002, this.mouse.x * 0.002);
        const offset = new THREE.Vector3().setFromSpherical(spherical);
        cameraPosition.add(offset);
        
        this.camera.position.copy(cameraPosition);
        this.camera.lookAt(this.player.position.x, this.player.position.y + 1, this.player.position.z);
    }
    
    updateWeapon(deltaTime) {
        const weapon = this.player.weapons[this.player.currentWeapon];
        
        // Handle reloading
        if (weapon.reloading) {
            // Reloading is handled by the reload timer
            return;
        }
        
        // Handle shooting
        if (this.controls.shoot && !weapon.reloading) {
            const now = Date.now();
            const timeSinceLastShot = now - weapon.lastFired;
            const fireInterval = 60000 / weapon.fireRate; // Convert RPM to ms
            
            if (timeSinceLastShot >= fireInterval && weapon.currentAmmo > 0) {
                this.fireWeapon();
                weapon.lastFired = now;
                weapon.currentAmmo--;
            }
        }
        
        // Auto-reload when empty
        if (weapon.currentAmmo === 0 && weapon.totalAmmo > 0 && !weapon.reloading) {
            this.reloadWeapon();
        }
    }
    
    fireWeapon() {
        const weapon = this.player.weapons[this.player.currentWeapon];
        
        // Create projectile
        this.createProjectile();
        
        // Play sound
        this.playSound('shoot');
        
        // Add muzzle flash
        this.createMuzzleFlash();
        
        // Update UI
        this.updateAmmoDisplay();
    }
    
    createProjectile() {
        const weapon = this.player.weapons[this.player.currentWeapon];
        
        // Calculate projectile direction
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        const projectile = {
            position: this.player.position.clone(),
            direction: direction.clone(),
            speed: 50,
            damage: weapon.damage,
            life: 3.0, // 3 seconds
            mesh: null,
            body: null,
            type: weapon.name === "GRENADE LAUNCHER" ? 'grenade' : 'bullet'
        };
        
        // Adjust starting position
        projectile.position.add(direction.clone().multiplyScalar(2));
        projectile.position.y += 1.5;
        
        // Create visual
        let geometry, material;
        if (projectile.type === 'grenade') {
            geometry = new THREE.SphereGeometry(0.2, 8, 8);
            material = new THREE.MeshPhongMaterial({ color: 0xff4400, emissive: 0xff2200 });
        } else {
            geometry = new THREE.SphereGeometry(0.05, 4, 4);
            material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        }
        
        projectile.mesh = new THREE.Mesh(geometry, material);
        projectile.mesh.position.copy(projectile.position);
        this.scene.add(projectile.mesh);
        
        // Create physics
        this.createProjectilePhysics(projectile);
        
        this.projectiles.push(projectile);
    }
    
    createProjectilePhysics(projectile) {
        const radius = projectile.type === 'grenade' ? 0.2 : 0.05;
        const shape = new this.Ammo.btSphereShape(radius);
        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(
            projectile.position.x,
            projectile.position.y,
            projectile.position.z
        ));
        
        const mass = projectile.type === 'grenade' ? 1 : 0.1;
        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        
        const motionState = new this.Ammo.btDefaultMotionState(transform);
        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
            mass, motionState, shape, localInertia
        );
        
        projectile.body = new this.Ammo.btRigidBody(rbInfo);
        
        // Apply initial velocity
        const velocity = projectile.direction.clone().multiplyScalar(projectile.speed);
        projectile.body.setLinearVelocity(new this.Ammo.btVector3(velocity.x, velocity.y, velocity.z));
        
        this.physics.addRigidBody(projectile.body);
    }
    
    createMuzzleFlash() {
        const flashGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const flashMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        flash.position.copy(this.player.position);
        flash.position.add(direction.clone().multiplyScalar(2));
        flash.position.y += 1.5;
        
        this.scene.add(flash);
        
        // Remove flash after short time
        setTimeout(() => {
            this.scene.remove(flash);
        }, 100);
    }
    
    reloadWeapon() {
        const weapon = this.player.weapons[this.player.currentWeapon];
        
        if (weapon.totalAmmo === 0 || weapon.reloading) return;
        
        weapon.reloading = true;
        this.playSound('reload');
        this.showNotification(`Reloading ${weapon.name}...`, 'info');
        
        setTimeout(() => {
            const ammoNeeded = weapon.maxAmmo - weapon.currentAmmo;
            const ammoToReload = Math.min(ammoNeeded, weapon.totalAmmo);
            
            weapon.currentAmmo += ammoToReload;
            weapon.totalAmmo -= ammoToReload;
            weapon.reloading = false;
            
            this.updateAmmoDisplay();
            this.showNotification('Reload complete!', 'success');
        }, weapon.reloadTime);
    }
    
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            if (enemy.health <= 0) {
                enemy.state = 'dead';
                return;
            }
            
            this.updateEnemyAI(enemy, deltaTime);
            this.updateEnemyPosition(enemy);
        });
    }
    
    updateEnemyAI(enemy, deltaTime) {
        const distanceToPlayer = enemy.position.distanceTo(this.player.position);
        
        switch (enemy.state) {
            case 'patrol':
                this.handleEnemyPatrol(enemy, deltaTime);
                
                // Check if player is in sight
                if (distanceToPlayer < 30) {
                    enemy.state = 'chase';
                    enemy.target = this.player.position.clone();
                }
                break;
                
            case 'chase':
                this.handleEnemyChase(enemy, deltaTime);
                
                // Check if in attack range
                if (distanceToPlayer < enemy.attackRange) {
                    enemy.state = 'attack';
                }
                
                // Lose player if too far
                if (distanceToPlayer > 50) {
                    enemy.state = 'patrol';
                    this.setNewPatrolTarget(enemy);
                }
                break;
                
            case 'attack':
                this.handleEnemyAttack(enemy, deltaTime);
                
                // Return to chase if player moves away
                if (distanceToPlayer > enemy.attackRange) {
                    enemy.state = 'chase';
                }
                break;
        }
    }
    
    handleEnemyPatrol(enemy, deltaTime) {
        const distanceToTarget = enemy.position.distanceTo(enemy.patrolTarget);
        
        if (distanceToTarget < 2) {
            this.setNewPatrolTarget(enemy);
        } else {
            this.moveEnemyTowards(enemy, enemy.patrolTarget, deltaTime);
        }
    }
    
    handleEnemyChase(enemy, deltaTime) {
        enemy.target = this.player.position.clone();
        this.moveEnemyTowards(enemy, enemy.target, deltaTime);
    }
    
    handleEnemyAttack(enemy, deltaTime) {
        const now = Date.now();
        
        if (now - enemy.lastAttack > enemy.attackCooldown) {
            this.enemyAttackPlayer(enemy);
            enemy.lastAttack = now;
        }
    }
    
    moveEnemyTowards(enemy, target, deltaTime) {
        const direction = new THREE.Vector3().subVectors(target, enemy.position).normalize();
        const moveDistance = enemy.speed * deltaTime;
        
        const newPosition = enemy.position.clone().add(direction.multiplyScalar(moveDistance));
        
        // Apply movement via physics
        if (enemy.body) {
            const velocity = direction.multiplyScalar(enemy.speed);
            velocity.y = enemy.body.getLinearVelocity().y(); // Preserve Y velocity
            enemy.body.setLinearVelocity(new this.Ammo.btVector3(velocity.x, velocity.y, velocity.z));
        }
    }
    
    setNewPatrolTarget(enemy) {
        enemy.patrolTarget = new THREE.Vector3(
            enemy.position.x + (Math.random() - 0.5) * 20,
            enemy.position.y,
            enemy.position.z + (Math.random() - 0.5) * 20
        );
    }
    
    enemyAttackPlayer(enemy) {
        // Create attack projectile
        const direction = new THREE.Vector3().subVectors(this.player.position, enemy.position).normalize();
        
        const projectile = {
            position: enemy.position.clone(),
            direction: direction,
            speed: 20,
            damage: enemy.damage,
            life: 2.0,
            mesh: null,
            body: null,
            type: 'enemy_bullet',
            enemy: true
        };
        
        // Visual
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        projectile.mesh = new THREE.Mesh(geometry, material);
        projectile.mesh.position.copy(projectile.position);
        this.scene.add(projectile.mesh);
        
        // Physics
        this.createProjectilePhysics(projectile);
        
        this.projectiles.push(projectile);
        this.playSound('enemyShoot');
    }
    
    updateEnemyPosition(enemy) {
        if (!enemy.body) return;
        
        const ms = enemy.body.getMotionState();
        if (ms) {
            const transform = new this.Ammo.btTransform();
            ms.getWorldTransform(transform);
            const origin = transform.getOrigin();
            
            enemy.position.set(origin.x(), origin.y(), origin.z());
            enemy.mesh.position.copy(enemy.position);
        }
    }
    
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            projectile.life -= deltaTime;
            
            if (projectile.life <= 0) {
                this.removeProjectile(i);
                continue;
            }
            
            // Update position from physics
            if (projectile.body) {
                const ms = projectile.body.getMotionState();
                if (ms) {
                    const transform = new this.Ammo.btTransform();
                    ms.getWorldTransform(transform);
                    const origin = transform.getOrigin();
                    
                    projectile.position.set(origin.x(), origin.y(), origin.z());
                    projectile.mesh.position.copy(projectile.position);
                }
            }
            
            // Check collisions
            this.checkProjectileCollisions(projectile, i);
        }
    }
    
    checkProjectileCollisions(projectile, index) {
        // Check collision with enemies (if player projectile)
        if (!projectile.enemy) {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (enemy.health <= 0) return;
                
                const distance = projectile.position.distanceTo(enemy.position);
                if (distance < 1.5) {
                    this.hitEnemy(enemy, projectile.damage);
                    
                    if (projectile.type === 'grenade') {
                        this.createExplosion(projectile.position);
                    }
                    
                    this.removeProjectile(index);
                }
            });
        }
        
        // Check collision with player (if enemy projectile)
        if (projectile.enemy) {
            const distance = projectile.position.distanceTo(this.player.position);
            if (distance < 2) {
                this.hitPlayer(projectile.damage);
                this.removeProjectile(index);
            }
        }
        
        // Check collision with destructibles
        this.destructibles.forEach((destructible, destructibleIndex) => {
            if (destructible.destroyed) return;
            
            const distance = projectile.position.distanceTo(destructible.mesh.position);
            if (distance < 2) {
                this.hitDestructible(destructible, projectile.damage);
                
                if (projectile.type === 'grenade') {
                    this.createExplosion(projectile.position);
                }
                
                this.removeProjectile(index);
            }
        });
    }
    
    hitEnemy(enemy, damage) {
        enemy.health -= damage;
        this.playSound('enemyHit');
        
        // Create hit effect
        this.createHitEffect(enemy.position);
        
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
    }
    
    hitPlayer(damage) {
        this.player.health -= damage;
        this.playSound('playerHit');
        
        // Create damage effect
        this.createDamageEffect();
        
        if (this.player.health <= 0) {
            this.gameOver();
        }
        
        this.updateHealthDisplay();
    }
    
    hitDestructible(destructible, damage) {
        destructible.health -= damage;
        
        if (destructible.health <= 0) {
            this.destroyDestructible(destructible);
        }
    }
    
    killEnemy(enemy) {
        // Award XP
        const xpGain = 25;
        this.addXP(xpGain);
        
        // Create death effect
        this.createDeathEffect(enemy.position);
        
        // Remove from physics
        if (enemy.body) {
            this.physics.removeRigidBody(enemy.body);
        }
        
        // Remove from scene
        this.scene.remove(enemy.mesh);
        
        // Mark as dead
        enemy.health = 0;
        enemy.state = 'dead';
        
        this.showNotification(`Enemy eliminated! +${xpGain} XP`, 'success');
    }
    
    destroyDestructible(destructible) {
        // Create destruction effect
        this.createDestructionEffect(destructible.mesh.position);
        
        // Remove from physics
        if (destructible.body) {
            this.physics.removeRigidBody(destructible.body);
        }
        
        // Remove from scene
        this.scene.remove(destructible.mesh);
        
        destructible.destroyed = true;
        
        // Chance to drop pickup
        if (Math.random() < 0.3) {
            this.createPickupAt(destructible.mesh.position);
        }
    }
    
    createExplosion(position) {
        // Create explosion visual
        const explosionGeometry = new THREE.SphereGeometry(3, 16, 16);
        const explosionMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff4400,
            transparent: true,
            opacity: 0.8
        });
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.copy(position);
        this.scene.add(explosion);
        
        // Play sound
        this.playSound('explosion');
        
        // Damage nearby objects
        const explosionRadius = 5;
        
        // Check enemies
        this.enemies.forEach(enemy => {
            const distance = position.distanceTo(enemy.position);
            if (distance < explosionRadius) {
                const damage = 50 * (1 - distance / explosionRadius);
                this.hitEnemy(enemy, damage);
            }
        });
        
        // Check player
        const playerDistance = position.distanceTo(this.player.position);
        if (playerDistance < explosionRadius) {
            const damage = 30 * (1 - playerDistance / explosionRadius);
            this.hitPlayer(damage);
        }
        
        // Check destructibles
        this.destructibles.forEach(destructible => {
            const distance = position.distanceTo(destructible.mesh.position);
            if (distance < explosionRadius) {
                const damage = 100 * (1 - distance / explosionRadius);
                this.hitDestructible(destructible, damage);
            }
        });
        
        // Remove explosion effect
        setTimeout(() => {
            this.scene.remove(explosion);
        }, 500);
    }
    
    createHitEffect(position) {
        const effectGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const effectMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });
        const effect = new THREE.Mesh(effectGeometry, effectMaterial);
        effect.position.copy(position);
        this.scene.add(effect);
        
        setTimeout(() => {
            this.scene.remove(effect);
        }, 200);
    }
    
    createDamageEffect() {
        // Screen flash effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(255, 0, 0, 0.3)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 200);
    }
    
    createDeathEffect(position) {
        // Create multiple particles
        for (let i = 0; i < 10; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff4400 });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(position);
            particle.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            ));
            
            this.scene.add(particle);
            
            setTimeout(() => {
                this.scene.remove(particle);
            }, 1000);
        }
    }
    
    createDestructionEffect(position) {
        // Similar to death effect but with different colors
        for (let i = 0; i < 15; i++) {
            const particleGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(position);
            particle.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                Math.random() * 3,
                (Math.random() - 0.5) * 3
            ));
            
            this.scene.add(particle);
            
            setTimeout(() => {
                this.scene.remove(particle);
            }, 2000);
        }
    }
    
    createPickupAt(position) {
        const pickup = {
            type: Math.random() < 0.5 ? 'ammo' : 'health',
            mesh: null,
            collected: false
        };
        
        const color = pickup.type === 'ammo' ? 0x00ff00 : 0xff0000;
        const pickupGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const pickupMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.3
        });
        pickup.mesh = new THREE.Mesh(pickupGeometry, pickupMaterial);
        pickup.mesh.position.copy(position);
        pickup.mesh.position.y += 1;
        this.scene.add(pickup.mesh);
        
        if (pickup.type === 'ammo') {
            pickup.effect = () => this.addAmmo(30);
        } else {
            pickup.effect = () => this.addHealth(25);
        }
        
        this.pickups.push(pickup);
    }
    
    removeProjectile(index) {
        const projectile = this.projectiles[index];
        
        if (projectile.body) {
            this.physics.removeRigidBody(projectile.body);
        }
        
        this.scene.remove(projectile.mesh);
        this.projectiles.splice(index, 1);
    }
    
    updatePickups(deltaTime) {
        this.pickups.forEach((pickup, index) => {
            if (pickup.collected) return;
            
            // Rotate pickup
            pickup.mesh.rotation.y += deltaTime * 2;
            pickup.mesh.position.y += Math.sin(Date.now() * 0.003) * 0.01;
            
            // Check if player is close
            const distance = pickup.mesh.position.distanceTo(this.player.position);
            if (distance < 2) {
                this.collectPickup(pickup, index);
            }
        });
    }
    
    collectPickup(pickup, index) {
        pickup.effect();
        pickup.collected = true;
        
        this.scene.remove(pickup.mesh);
        this.pickups.splice(index, 1);
        
        this.playSound('pickup');
        this.showNotification(`Collected ${pickup.type}!`, 'success');
    }
    
    addAmmo(amount = 30) {
        const weapon = this.player.weapons[this.player.currentWeapon];
        weapon.totalAmmo += amount;
        this.updateAmmoDisplay();
    }
    
    addHealth(amount = 25) {
        this.player.health = Math.min(this.player.health + amount, this.player.maxHealth);
        this.updateHealthDisplay();
    }
    
    addXP(amount = 25) {
        this.player.xp += amount;
        
        if (this.player.xp >= this.player.xpToNext) {
            this.levelUp();
        }
        
        this.updateXPDisplay();
    }
    
    levelUp() {
        this.player.level++;
        this.player.xp -= this.player.xpToNext;
        this.player.xpToNext = Math.floor(this.player.xpToNext * 1.5);
        
        // Level benefits
        this.player.maxHealth += 10;
        this.player.health = this.player.maxHealth; // Full heal on level up
        
        this.playSound('levelUp');
        this.showNotification(`LEVEL UP! You are now level ${this.player.level}!`, 'success');
        
        this.updateHealthDisplay();
        this.updateXPDisplay();
    }
    
    updateParticles(deltaTime) {
        if (this.particleSystem) {
            this.particleSystem.rotation.y += deltaTime * 0.1;
        }
    }
    
    updateUI() {
        this.updateHealthDisplay();
        this.updateAmmoDisplay();
        this.updateXPDisplay();
        this.updateMinimap();
    }
    
    updateHealthDisplay() {
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-fill').style.width = `${healthPercent}%`;
        document.getElementById('health-text').textContent = `${Math.round(this.player.health)}/${this.player.maxHealth}`;
    }
    
    updateAmmoDisplay() {
        const weapon = this.player.weapons[this.player.currentWeapon];
        document.getElementById('weapon-name').textContent = weapon.name;
        document.getElementById('ammo-current').textContent = weapon.currentAmmo;
        document.getElementById('ammo-total').textContent = weapon.totalAmmo;
    }
    
    updateXPDisplay() {
        document.getElementById('player-level').textContent = this.player.level;
        document.getElementById('player-xp').textContent = `${this.player.xp}/${this.player.xpToNext}`;
    }
    
    updateMinimap() {
        const canvas = document.getElementById('minimap-canvas');
        const ctx = canvas.getContext('2d');
        
        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 150, 150);
        
        // Draw player
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(70, 70, 10, 10);
        
        // Draw enemies
        ctx.fillStyle = '#ff0000';
        this.enemies.forEach(enemy => {
            if (enemy.health <= 0) return;
            
            const x = (enemy.position.x / 200) * 150 + 75;
            const z = (enemy.position.z / 200) * 150 + 75;
            
            if (x >= 0 && x <= 150 && z >= 0 && z <= 150) {
                ctx.fillRect(x - 2, z - 2, 4, 4);
            }
        });
        
        // Draw pickups
        ctx.fillStyle = '#ffff00';
        this.pickups.forEach(pickup => {
            const x = (pickup.mesh.position.x / 200) * 150 + 75;
            const z = (pickup.mesh.position.z / 200) * 150 + 75;
            
            if (x >= 0 && x <= 150 && z >= 0 && z <= 150) {
                ctx.fillRect(x - 1, z - 1, 2, 2);
            }
        });
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    // Event Handlers
    onKeyDown(event) {
        if (this.gameState !== 'playing') return;
        
        switch (event.code) {
            case 'KeyW': this.controls.forward = true; break;
            case 'KeyS': this.controls.backward = true; break;
            case 'KeyA': this.controls.left = true; break;
            case 'KeyD': this.controls.right = true; break;
            case 'Space': this.controls.jump = true; event.preventDefault(); break;
            case 'ShiftLeft': this.controls.sprint = true; break;
            case 'KeyC': this.controls.crouch = true; break;
            case 'KeyR': this.controls.reload = true; this.reloadWeapon(); break;
            case 'Digit1': this.selectWeapon(0); break;
            case 'Digit2': this.selectWeapon(1); break;
            case 'Digit3': this.selectWeapon(2); break;
        }
    }
    
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.controls.forward = false; break;
            case 'KeyS': this.controls.backward = false; break;
            case 'KeyA': this.controls.left = false; break;
            case 'KeyD': this.controls.right = false; break;
            case 'Space': this.controls.jump = false; break;
            case 'ShiftLeft': this.controls.sprint = false; break;
            case 'KeyC': this.controls.crouch = false; break;
            case 'KeyR': this.controls.reload = false; break;
        }
    }
    
    onMouseMove(event) {
        if (!this.mouse.locked || this.gameState !== 'playing') return;
        
        this.mouse.x += event.movementX * this.mouse.sensitivity;
        this.mouse.y += event.movementY * this.mouse.sensitivity;
        
        // Clamp vertical rotation
        this.mouse.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouse.y));
    }
    
    onMouseDown(event) {
        if (this.gameState !== 'playing') return;
        
        if (event.button === 0) { // Left click
            this.controls.shoot = true;
        }
        
        // Request pointer lock
        if (!this.mouse.locked) {
            document.body.requestPointerLock();
        }
    }
    
    onMouseUp(event) {
        if (event.button === 0) { // Left click
            this.controls.shoot = false;
        }
    }
    
    onMouseWheel(event) {
        if (this.gameState !== 'playing') return;
        
        // Weapon switching
        if (event.deltaY > 0) {
            this.selectWeapon((this.player.currentWeapon + 1) % this.player.weapons.length);
        } else {
            this.selectWeapon((this.player.currentWeapon - 1 + this.player.weapons.length) % this.player.weapons.length);
        }
    }
    
    onPointerLockChange() {
        this.mouse.locked = document.pointerLockElement === document.body;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    selectWeapon(index) {
        if (index >= 0 && index < this.player.weapons.length) {
            this.player.currentWeapon = index;
            this.updateAmmoDisplay();
            
            // Update hotbar visual
            document.querySelectorAll('.hotbar-slot').forEach(slot => slot.classList.remove('active'));
            document.querySelector(`[data-slot="${index}"]`).classList.add('active');
        }
    }
    
    // Game State Management
    startGame() {
        this.gameState = 'playing';
        this.isGameRunning = true;
        
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
        
        // Request pointer lock
        document.body.requestPointerLock();
        
        this.gameLoop();
    }
    
    pauseGame() {
        this.gameState = 'paused';
        document.getElementById('pause-menu').classList.remove('hidden');
        document.exitPointerLock();
    }
    
    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pause-menu').classList.add('hidden');
        document.body.requestPointerLock();
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.isGameRunning = false;
        
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('game-hud').classList.add('hidden');
        document.getElementById('pause-menu').classList.add('hidden');
        document.exitPointerLock();
    }
    
    showSettings() {
        document.getElementById('settings-menu').classList.remove('hidden');
    }
    
    closeSettings() {
        document.getElementById('settings-menu').classList.add('hidden');
    }
    
    startTutorial() {
        this.tutorial.active = true;
        this.tutorial.step = 0;
        this.showTutorialStep();
    }
    
    showTutorialStep() {
        const step = this.tutorial.steps[this.tutorial.step];
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-text').textContent = step.text;
        document.getElementById('tutorial-overlay').classList.remove('hidden');
        
        // Update buttons
        document.getElementById('tutorial-prev').style.display = this.tutorial.step > 0 ? 'block' : 'none';
        document.getElementById('tutorial-next').textContent = 
            this.tutorial.step < this.tutorial.steps.length - 1 ? 'Next' : 'Start Game';
    }
    
    nextTutorialStep() {
        if (this.tutorial.step < this.tutorial.steps.length - 1) {
            this.tutorial.step++;
            this.showTutorialStep();
        } else {
            this.skipTutorial();
        }
    }
    
    prevTutorialStep() {
        if (this.tutorial.step > 0) {
            this.tutorial.step--;
            this.showTutorialStep();
        }
    }
    
    skipTutorial() {
        this.tutorial.active = false;
        document.getElementById('tutorial-overlay').classList.add('hidden');
        this.startGame();
    }
    
    saveGame() {
        const saveData = {
            player: {
                health: this.player.health,
                level: this.player.level,
                xp: this.player.xp,
                position: this.player.position.toArray(),
                weapons: this.player.weapons
            },
            timestamp: Date.now()
        };
        
        localStorage.setItem('cyberstrike_save', JSON.stringify(saveData));
        this.showNotification('Game saved!', 'success');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('cyberstrike_save');
        
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                
                // Restore player data
                this.player.health = data.player.health;
                this.player.level = data.player.level;
                this.player.xp = data.player.xp;
                this.player.position.fromArray(data.player.position);
                this.player.weapons = data.player.weapons;
                
                this.showNotification('Game loaded!', 'success');
                this.updateUI();
            } catch (error) {
                this.showNotification('Failed to load game!', 'error');
            }
        } else {
            this.showNotification('No save game found!', 'warning');
        }
    }
    
    gameOver() {
        this.showNotification('GAME OVER', 'error');
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
    }
    
    // Utility Functions
    updateLoadingProgress(progress, text) {
        this.loadingProgress = progress;
        document.getElementById('loading-progress').style.width = `${progress}%`;
        document.getElementById('loading-text').textContent = text;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.getElementById('notification-container').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    playSound(soundName) {
        // Placeholder sound generation
        switch (soundName) {
            case 'shoot':
                this.generateSound(800, 0.1, 'square');
                break;
            case 'reload':
                this.generateSound(400, 0.3, 'triangle');
                break;
            case 'explosion':
                this.generateSound(200, 0.5, 'sawtooth');
                break;
            case 'pickup':
                this.generateSound(1200, 0.2, 'sine');
                break;
            case 'levelUp':
                this.generateSound(1000, 0.5, 'sine');
                break;
            case 'enemyHit':
                this.generateSound(300, 0.1, 'square');
                break;
        }
    }
    
    applyGraphicsSettings() {
        // Adjust renderer settings based on quality
        switch (this.settings.graphics) {
            case 'low':
                this.renderer.shadowMap.enabled = false;
                this.renderer.setPixelRatio(1);
                break;
            case 'medium':
                this.renderer.shadowMap.enabled = true;
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                break;
            case 'high':
                this.renderer.shadowMap.enabled = true;
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                break;
        }
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new CyberStrikeGame();
});