# CyberStrike RPG Shooter

A high-graphics, physics-based RPG shooter game built with Three.js and Ammo.js. Experience futuristic combat in a fully interactive 3D world with destructible environments, AI enemies, and RPG progression systems.

![CyberStrike RPG Shooter](https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-r158-orange?style=for-the-badge)
![Ammo.js](https://img.shields.io/badge/Ammo.js-Physics-green?style=for-the-badge)

## 🎮 Features

### Core Gameplay
- **Third-person shooter** with smooth camera controls
- **Physics-based movement** with realistic collision detection
- **Multiple weapon types** with unique properties and behaviors
- **AI-controlled enemies** with pathfinding and combat behaviors
- **Destructible environment** with physics-based destruction
- **RPG progression system** with levels, XP, and skill upgrades

### Technical Features
- **Advanced 3D Graphics** using Three.js with PBR materials
- **Real-time Physics** powered by Ammo.js
- **Dynamic lighting** with shadows and post-processing effects
- **Particle systems** for explosions and atmospheric effects
- **Spatial audio** for immersive 3D sound
- **Performance optimization** with LOD and efficient rendering

### Game Systems
- **Health and damage** system with visual feedback
- **Ammunition management** with reloading mechanics
- **Inventory system** with weapon switching
- **Minimap** with real-time enemy tracking
- **Save/Load system** using localStorage
- **Settings menu** with graphics and audio options

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- WebGL 2.0 support
- At least 4GB RAM recommended for optimal performance

### Installation
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. The game will automatically load dependencies from CDN
4. Wait for initialization to complete
5. Click "Start Game" to begin playing

### Controls

#### Movement
- **W, A, S, D** - Move forward, left, backward, right
- **Mouse** - Look around / Aim
- **Shift** - Sprint
- **Space** - Jump
- **C** - Crouch

#### Combat
- **Left Mouse** - Shoot
- **Right Mouse** - Aim (future feature)
- **R** - Reload weapon
- **1, 2, 3** - Switch weapons
- **Mouse Wheel** - Cycle weapons

#### Interface
- **ESC** - Pause game
- **Tab** - Show inventory (future feature)
- **M** - Toggle minimap size (future feature)

## 🔧 Dependencies

### Core Libraries (Loaded via CDN)
- **Three.js r158** - 3D graphics rendering
  - `https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js`
- **Ammo.js 0.0.10** - Physics simulation
  - `https://cdn.jsdelivr.net/npm/ammo.js@0.0.10/builds/ammo.wasm.js`

### Three.js Modules
- **OrbitControls** - Camera control system
- **GLTFLoader** - 3D model loading (ready for custom assets)
- **EffectComposer** - Post-processing pipeline
- **RenderPass** - Basic rendering pass
- **UnrealBloomPass** - Bloom effect for atmosphere

## 🎨 Asset Sources

### Free Asset Recommendations

#### 3D Models
- **Mixamo** (mixamo.com) - Character animations and models
- **Sketchfab** (sketchfab.com) - Free 3D models with CC license
- **OpenGameArt** (opengameart.org) - Open source game assets
- **Kenney Assets** (kenney.nl) - Simple, clean game assets
- **Poly Haven** (polyhaven.com) - High-quality HDRIs and models

#### Audio
- **FreeSound** (freesound.org) - Sound effects library
- **OpenGameArt** (opengameart.org) - Game music and SFX
- **Zapsplat** (zapsplat.com) - Professional sound library
- **BBC Sound Effects** (bbcsfx.acropolis.org.uk) - BBC's free collection

#### Textures
- **Textures.com** (textures.com) - High-quality texture library
- **CC0 Textures** (cc0textures.com) - Public domain textures
- **Poly Haven** (polyhaven.com) - PBR texture sets
- **AmbientCG** (ambientcg.com) - Material and texture resources

## 🏗️ Project Structure

```
cyber-rpg-shooter/
├── index.html          # Main game interface and HUD
├── style.css           # Game styling and UI design
├── game.js             # Core game engine and logic
├── README.md           # This documentation
└── assets/             # Game assets (create this folder)
    ├── models/         # 3D models (.gltf, .fbx)
    ├── textures/       # Texture files (.jpg, .png)
    ├── audio/          # Sound files (.mp3, .wav)
    └── images/         # UI images and sprites
```

## ⚙️ Configuration

### Graphics Settings
The game includes three quality presets:

- **Low** - Disabled shadows, reduced resolution, basic effects
- **Medium** - Enabled shadows, standard resolution, moderate effects
- **High** - All effects enabled, high resolution, advanced post-processing

### Performance Optimization
- **Shadow Quality** - Adjustable in settings menu
- **Resolution Scaling** - Automatic based on device capabilities
- **LOD System** - Distance-based detail reduction
- **Frustum Culling** - Only render visible objects
- **Texture Compression** - Optimized texture loading

## 🎮 Gameplay Guide

### Getting Started
1. Complete the tutorial to learn basic controls
2. Use cover to avoid enemy fire
3. Collect ammo and health pickups
4. Destroy crates to find resources
5. Gain XP by defeating enemies

### Combat Tips
- **Plasma Rifle** - High rate of fire, good for multiple enemies
- **Grenade Launcher** - High damage, area effect, limited ammo
- **Reload timing** - Find safe moments to reload
- **Movement** - Stay mobile to avoid enemy attacks
- **Environment** - Use destructible cover strategically

### RPG Elements
- **Experience Points** - Gained by defeating enemies
- **Leveling Up** - Increases health and unlocks abilities
- **Weapon Progression** - Better weapons found or earned
- **Health Management** - Monitor health and seek healing items

## 🛠️ Customization

### Adding Custom Assets

#### 3D Models
1. Export models in GLTF format
2. Place in `assets/models/` directory
3. Update model loading code in `game.js`
4. Adjust physics collision shapes as needed

#### Audio Files
1. Convert audio to web-compatible formats (MP3, OGG)
2. Place in `assets/audio/` directory
3. Update audio loading system in `initAudio()` method
4. Configure 3D spatial audio properties

#### Textures
1. Optimize images for web (compressed, power-of-2 dimensions)
2. Place in `assets/textures/` directory
3. Update material definitions in `game.js`
4. Consider PBR workflow for realistic materials

### Code Customization

#### Adding New Weapons
```javascript
// Add to player.weapons array
{
    name: "NEW WEAPON",
    damage: 50,
    fireRate: 300,
    maxAmmo: 20,
    totalAmmo: 100,
    currentAmmo: 20,
    reloadTime: 2500,
    lastFired: 0,
    reloading: false
}
```

#### Creating New Enemy Types
```javascript
// Add to enemyTypes array in createEnemies()
{
    name: "NewEnemy",
    health: 75,
    speed: 3.5,
    damage: 25,
    attackRange: 18,
    color: 0xffaa00,
    size: 1.3
}
```

#### Adding New Pickups
```javascript
// Add to pickupTypes array in createPickup()
{ 
    type: 'shield', 
    color: 0x0088ff, 
    effect: () => this.addShield(50) 
}
```

## 🐛 Troubleshooting

### Common Issues

#### Game Won't Load
- Check browser console for errors
- Ensure WebGL 2.0 is supported
- Try disabling browser extensions
- Clear browser cache and reload

#### Poor Performance
- Lower graphics quality in settings
- Close other browser tabs
- Check available system memory
- Update graphics drivers

#### Controls Not Working
- Click on game canvas to focus
- Allow pointer lock when prompted
- Check if browser blocks pointer lock
- Try refreshing the page

#### Audio Issues
- Check browser audio permissions
- Ensure system volume is enabled
- Try different browser if issues persist
- Some browsers require user interaction before audio

### Browser Compatibility

#### Recommended Browsers
- **Chrome 90+** - Full feature support
- **Firefox 88+** - Full feature support
- **Safari 14+** - Full feature support
- **Edge 90+** - Full feature support

#### Known Limitations
- **Mobile browsers** - Limited due to performance constraints
- **Internet Explorer** - Not supported
- **Older browsers** - May lack WebGL 2.0 support

## 📈 Performance Monitoring

### FPS Optimization
- Target: 60 FPS on mid-range hardware
- Automatic quality scaling based on performance
- Real-time performance monitoring available
- Adjustable quality settings for different hardware

### Memory Management
- Automatic garbage collection for removed objects
- Efficient texture and geometry disposal
- Physics body cleanup when objects are destroyed
- Dynamic loading/unloading of distant assets

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Open in your preferred code editor
3. Use a local server for development (live-server, http-server)
4. Test changes across different browsers
5. Follow the existing code style and patterns

### Feature Requests
- Enhanced AI behaviors
- Additional weapon types
- Multiplayer support
- Level editor
- VR support

## 📄 License

This project is provided as-is for educational and development purposes. 

### Asset Licensing
- Use free/open source assets where possible
- Credit asset creators appropriately
- Ensure commercial use rights if needed
- Follow CC license requirements

### Third-party Dependencies
- Three.js - MIT License
- Ammo.js - zlib License
- Web fonts - Check individual licenses

## 🏆 Credits

### Development
- **Game Engine** - Built with Three.js and Ammo.js
- **UI Design** - Custom CSS with cyberpunk aesthetics
- **Physics** - Bullet Physics via Ammo.js
- **Audio** - Web Audio API implementation

### Special Thanks
- Three.js community for excellent documentation
- Bullet Physics for robust physics simulation
- Mozilla for WebGL specifications
- Open source asset creators

## 📞 Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Include browser version and system specifications

---

**Enjoy playing CyberStrike RPG Shooter!** 🎮🚀

*Built with ❤️ using modern web technologies*