function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function initCannon(){
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                            physicsMaterial,
                                                            0.0,
                                                            0.3
                                                            );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 2, radius = 0.5;

    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(-10, 1, 1);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);
}

function animate() {
    requestAnimationFrame( animate );

    if(controls.enabled){
        world.step(dt);

        // Update ball positions
        for(var i=0; i<balls.length; i++){
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
        }

        // Update box positions
        for(var i=0; i<boxes.length; i++){
            boxMeshes[i].position.copy(boxes[i].position);
            boxMeshes[i].quaternion.copy(boxes[i].quaternion);
        }
    }

    controls.update( Date.now() - time );
    renderer.render( scene, camera );
    time = Date.now();
}

function addLights(){
    light3 = new THREE.SpotLight( 0xffffff );
    light3.position.set( 10, 30, 20 );
    light3.target.position.set( 0, 0, 0 );
    if(true){
        light3.castShadow = true;
        light3.shadowCameraNear = 20;
        light3.shadowCameraFar = 50;
        light3.shadowCameraFov = 40;
        light3.shadowMapBias = 0.1;
        light3.shadowMapDarkness = 0.7;
        light3.shadowMapWidth = 2*512;
        light3.shadowMapHeight = 2*512;
    }
    scene.add( light3 );


    light2 = new THREE.SpotLight( 0xffffff);
    light2.position.set( 5, -100, 0 );
    light2.target.position.set( 0, 0, 0 );
    if(true){
        light2.castShadow = true;
        light2.shadowCameraNear = 20;
        light2.shadowCameraFar = 50;
        light2.shadowCameraFov = 40;
        light2.shadowMapBias = 0.1;
        light2.shadowMapDarkness = 0.99;
        light2.shadowMapWidth = 2*512;
        light2.shadowMapHeight = 2*512;
    }
    scene.add( light2 );


    lightTOP = new THREE.SpotLight( 0xffffff);
    lightTOP.position.set( 5, 100, 0 );
    lightTOP.target.position.set( 0, 0, 0 );
    if(true){
        lightTOP.castShadow = true;
        lightTOP.shadowCameraNear = 20;
        lightTOP.shadowCameraFar = 50;
        lightTOP.shadowCameraFov = 40;
        lightTOP.shadowMapBias = 0.1;
        lightTOP.shadowMapDarkness = 0.99;
        lightTOP.shadowMapWidth = 2*512;
        lightTOP.shadowMapHeight = 2*512;
    }
    scene.add( lightTOP );


    lightRIGHT = new THREE.SpotLight( 0x888888);
    lightRIGHT.position.set( 5, 0, 100 );
    lightRIGHT.target.position.set( 0, 0, 0 );
    if(true){
        lightRIGHT.castShadow = true;
        lightRIGHT.shadowCameraNear = 20;
        lightRIGHT.shadowCameraFar = 50;
        lightRIGHT.shadowCameraFov = 40;
        lightRIGHT.shadowMapBias = 0.1;
        lightRIGHT.shadowMapDarkness = 0.99;
        lightRIGHT.shadowMapWidth = 2*512;
        lightRIGHT.shadowMapHeight = 2*512;
    }
    scene.add( lightRIGHT );


    lightLEFT = new THREE.SpotLight( 0x888888);
    lightLEFT.position.set( 5, 0, -100 );
    lightLEFT.target.position.set( 0, 0, 0 );
    if(true){
        lightLEFT.castShadow = true;
        lightLEFT.shadowCameraNear = 20;
        lightLEFT.shadowCameraFar = 50;
        lightLEFT.shadowCameraFov = 40;
        lightLEFT.shadowMapBias = 0.1;
        lightLEFT.shadowMapDarkness = 0.99;
        lightLEFT.shadowMapWidth = 2*512;
        lightLEFT.shadowMapHeight = 2*512;
    }
    scene.add( lightLEFT );


    lightBack = new THREE.SpotLight( 0x888888);
    lightBack.position.set( 100, 0, 0 );
    lightBack.target.position.set( 0, 0, 0 );
    if(true){
        lightBack.castShadow = true;
        lightBack.shadowCameraNear = 20;
        lightBack.shadowCameraFar = 50;
        lightBack.shadowCameraFov = 40;
        lightBack.shadowMapBias = 0.1;
        lightBack.shadowMapDarkness = 0.99;
        lightBack.shadowMapWidth = 2*512;
        lightBack.shadowMapHeight = 2*512;
    }
    scene.add( lightBack );


    lightFront = new THREE.SpotLight( 0xD1DCDF);
    lightFront.position.set( -100, 0, 0 );
    lightFront.target.position.set( 0, 0, 0 );
    if(true){
        lightFront.castShadow = true;
        lightFront.shadowCameraNear = 20;
        lightFront.shadowCameraFar = 50;
        lightFront.shadowCameraFov = 40;
        lightFront.shadowMapBias = 0.1;
        lightFront.shadowMapDarkness = 0.99;
        lightFront.shadowMapWidth = 2*512;
        lightFront.shadowMapHeight = 2*512;
    }
    scene.add( lightFront );
}

function addWall(material, x, y, z, x_axis, y_axis, z_axis, rotate){
    var halfExtents = new CANNON.Vec3(x_axis, y_axis, z_axis);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);

    var boxBody = new CANNON.Body({ mass: 0 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh( boxGeometry, material );
    world.add(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(x,y,z);
    boxMesh.position.set(x,y,z);
    boxMesh.castShadow = false;
    boxMesh.receiveShadow = false;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
}


function addNewFloors(count){
    material_wall = new THREE.MeshPhongMaterial( { color: 0x88888 } );
    material_floor = new THREE.MeshPhongMaterial( { color: 0x000 } );
    material_ceiling = new THREE.MeshPhongMaterial( { color: 0x9D7BD1 } );

    for(var i=0; i<count; i++){
        addWall(material_wall, x=0, y=i*2+3 , z=0, x_axis=5, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-3, y=i*2+3, z=1, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=-3, y=i*2+3, z=4, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=-3, y=i*2+3.8, z=2.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
        addWall(material_wall, x=0, y=i*2+3 , z=5, x_axis=5, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-5, y=i*2+2.25, z=2.5, x_axis=0.05, y_axis=0.3, z_axis=2.5);  
        addWall(material_wall, x=5, y=i*2+3, z=1, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=5, y=i*2+3, z=4, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=5, y=i*2+3.8, z=2.5, x_axis=0.05, y_axis=0.2, z_axis=0.5);  
        addWall(material_wall, x=-5, y=i*2+3 , z=6.45, x_axis=0.05, y_axis=1, z_axis=1.5); 
        addWall(material_wall, x=-4.05, y=i*2+3 , z=8, x_axis=1, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-3, y=i*2+3 , z=9.95, x_axis=0.05, y_axis=1, z_axis=2); 
        addWall(material_wall, x=-1.25, y=i*2+3 , z=12, x_axis=1.8, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-3, y=i*2+3 , z=14.5, x_axis=0.05, y_axis=1, z_axis=2.5); 
        addWall(material_wall, x=3.25, y=i*2+3 , z=12, x_axis=1.7, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=1.05, y=i*2+3.8, z=12, x_axis=0.5, y_axis=0.2, z_axis=0.05);  
        addWall(material_wall, x=5, y=i*2+3, z=7, x_axis=0.05, y_axis=1, z_axis=2); 
        addWall(material_wall, x=5, y=i*2+3, z=11, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=5, y=i*2+3.8, z=9.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
        addWall(material_wall, x=0.95, y=i*2+3 , z=17, x_axis=4, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=5, y=i*2+3, z=14.5 , x_axis=0.05, y_axis=1, z_axis=2.55) 
        addWall(material_wall, x=-5, y=i*2+3 , z=-1.45, x_axis=0.05, y_axis=1, z_axis=1.5); 
        addWall(material_wall, x=-4.05, y=i*2+3 , z=-2.95, x_axis=1, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-3, y=i*2+3 , z=-6, x_axis=0.05, y_axis=1, z_axis=3.1); 
        addWall(material_wall, x=5, y=i*2+3, z=-2, x_axis=0.05, y_axis=1, z_axis=2); 
        addWall(material_wall, x=5, y=i*2+3, z=-7, x_axis=0.05, y_axis=1, z_axis=2); 
        addWall(material_wall, x=5, y=i*2+3.8, z=-4.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
        addWall(material_wall, x=-1.25, y=i*2+3 , z=-9.05, x_axis=1.8, y_axis=1, z_axis=0.05);
        addWall(material_wall, x=3.25, y=i*2+3 , z=-9.05, x_axis=1.7, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=1.05, y=i*2+3.8, z=-9.05, x_axis=0.5, y_axis=0.2, z_axis=0.05);
        addWall(material_wall, x=-3, y=i*2+3 , z=-10.5, x_axis=0.05, y_axis=1, z_axis=1.5); 
        addWall(material_wall, x=1, y=i*2+3 , z=-11.95, x_axis=4, y_axis=1, z_axis=0.05);
        addWall(material_wall, x=5, y=i*2+3 , z=-10.5, x_axis=0.05, y_axis=1, z_axis=1.5); 
        addWall(material_wall, x=-3.7, y=i*2+3 , z=-11.95, x_axis=0.7, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=-4.4, y=i*2+3 , z=-14.4, x_axis=0.05, y_axis=1, z_axis=2.5); 
        addWall(material_wall, x=-1.95, y=i*2+3 , z=-16.9, x_axis=2.5, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=0.55, y=i*2+3 , z=-15.95, x_axis=0.05, y_axis=1, z_axis=1); 
        addWall(material_wall, x=4, y=i*2+3 , z=-12.5, x_axis=0.05, y_axis=1, z_axis=0.5); 
        addWall(material_wall, x=4, y=i*2+3 , z=-14.5, x_axis=0.05, y_axis=1, z_axis=0.5); 
        addWall(material_wall, x=4, y=i*2+3.8, z=-13.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
        addWall(material_wall, x=2.3, y=i*2+3 , z=-15, x_axis=1.75, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=5.8, y=i*2+3 , z=-15, x_axis=1.75, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=6.8, y=i*2+3 , z=-9.05, x_axis=0.7, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=5.5, y=i*2+3.8, z=-9.05, x_axis=0.6, y_axis=0.2, z_axis=0.05);  
        addWall(material_wall, x=7.5, y=i*2+3, z=-7, x_axis=0.05, y_axis=1, z_axis=2.1); 
        addWall(material_wall, x=7.5, y=i*2+3 , z=-12, x_axis=0.05, y_axis=1, z_axis=3);
        addWall(material_wall, x=10.5, y=i*2+3 , z=-9.05, x_axis=3, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=13.5, y=i*2+3, z=-5.6, x_axis=0.05, y_axis=1, z_axis=3.5);
        addWall(material_wall, x=8, y=i*2+3 , z=-2.1, x_axis=0.5, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=9, y=i*2+3.8, z=-2.1, x_axis=0.5, y_axis=0.2, z_axis=0.05);  
        addWall(material_wall, x=11.5, y=i*2+3 , z=-2.1, x_axis=2, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=7.5, y=i*2+3, z=-2.95, x_axis=0.05, y_axis=1, z_axis=0.9); 
        addWall(material_wall, x=7.5, y=i*2+3.8, z=-4.4, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
        addWall(material_wall, x=7.5, y=i*2+3, z=-0.05, x_axis=0.05, y_axis=1, z_axis=2); 
        addWall(material_wall, x=7.5, y=i*2+3, z=5.1, x_axis=0.05, y_axis=1, z_axis=2.1); 
        addWall(material_wall, x=7.5, y=i*2+3.8, z=2.45, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
        addWall(material_wall, x=8, y=i*2+3 , z=7.15, x_axis=0.5, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=9, y=i*2+3.8, z=7.15, x_axis=0.5, y_axis=0.2, z_axis=0.05); 
        addWall(material_wall, x=11.5, y=i*2+3 , z=7.15, x_axis=2, y_axis=1, z_axis=0.05); 
        addWall(material_wall, x=13.5, y=i*2+3, z=2.5, x_axis=0.05, y_axis=1, z_axis=4.7); 
        addWall(material_wall, x=7.5, y=i*2+3, z=8.1, x_axis=0.05, y_axis=1, z_axis=0.9); 
        addWall(material_wall, x=7.5, y=i*2+3.8, z=9.55, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
        addWall(material_wall, x=7.5, y=i*2+3, z=12.1, x_axis=0.05, y_axis=1, z_axis=2);
        addWall(material_wall, x=10.6, y=i*2+3, z=15.55, x_axis=0.05, y_axis=1, z_axis=1.5);
        addWall(material_wall, x=13.5, y=i*2+3, z=10.6, x_axis=0.05, y_axis=1, z_axis=3.5);
        addWall(material_wall, x=10.5, y=i*2+3 , z=14.05, x_axis=3, y_axis=1, z_axis=0.05);
        addWall(material_wall, x=7.8, y=i*2+3 , z=17, x_axis=2.8, y_axis=1, z_axis=0.05);
        addWall(material_wall, x=6.8, y=i*2+3 , z=14.05, x_axis=0.65, y_axis=1, z_axis=0.05);
        addWall(material_wall, x=5.6, y=i*2+3.8, z=14.05, x_axis=0.6, y_axis=0.2, z_axis=0.05);


        // stairs
        addWall(material_wall, x=6.7, y=i*2+2.015, z=16.25, x_axis=0.15, y_axis=0.01, z_axis=0.75);
        addWall(material_wall, x=7, y=i*2+2.05, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.3, y=i*2+2.15, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.6, y=i*2+2.25, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.9, y=i*2+2.35, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.2, y=i*2+2.45, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.5, y=i*2+2.55, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.8, y=i*2+2.65, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=9.1, y=i*2+2.75, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=9.4, y=i*2+2.85, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=10.05, y=i*2+2.95, z=15.5, x_axis=0.5, y_axis=0.05, z_axis=1.5); // platform

        addWall(material_wall, x=9.4, y=i*2+3.05, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=9.1, y=i*2+3.15, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.8, y=i*2+3.25, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.5, y=i*2+3.35, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=8.2, y=i*2+3.45, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.9, y=i*2+3.55, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.6, y=i*2+3.65, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7.3, y=i*2+3.75, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=7, y=i*2+3.85, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
        addWall(material_wall, x=6.7, y=i*2+3.95, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);



        addWall(material_floor, x=-3.95, y=i*2+2.01 , z=2.5, x_axis=1, y_axis=0.01, z_axis=2.5);
        addWall(material_wall, x=-3.95, y=i*2+1.96 , z=2.5, x_axis=1, y_axis=0.01, z_axis=2.5);


        addWall(material_floor, x=5.25, y=i*2+2.01 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
        addWall(material_floor, x=2.25, y=i*2+2.01 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
        addWall(material_floor, x=-3.95, y=i*2+2.01 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
        addWall(material_floor, x=-3.95, y=i*2+2.01 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
        addWall(material_floor, x=1.77, y=i*2+2.01 , z=15.5, x_axis=4.78, y_axis=0.01, z_axis=1.5);
        addWall(material_floor, x=-1.9, y=i*2+2.01 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
        addWall(material_floor, x=-3.65, y=i*2+2.01 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5);
        addWall(material_ceiling, x=5.25, y=i*2+3.99 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
        addWall(material_ceiling, x=2.25, y=i*2+3.99 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
        addWall(material_ceiling, x=-3.95, y=i*2+3.99 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
        addWall(material_ceiling, x=-3.95, y=i*2+3.99 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
        addWall(material_ceiling, x=1.77, y=i*2+3.99 , z=15.5, x_axis=4.78, y_axis=0.01, z_axis=1.5); 
        addWall(material_ceiling, x=-1.9, y=i*2+3.99 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
        addWall(material_ceiling, x=-3.65, y=i*2+3.99 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5);
        addWall(material_floor, x=5.25, y=i*2+4.01 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
        addWall(material_floor, x=2.25, y=i*2+4.01 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
        addWall(material_floor, x=-3.95, y=i*2+4.01 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
        addWall(material_floor, x=-3.95, y=i*2+4.01 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
        addWall(material_floor, x=1.77, y=i*2+4.01 , z=15.5, x_axis=4.78, y_axis=0.01, z_axis=1.5); 
        addWall(material_floor, x=-1.9, y=i*2+4.01 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
        addWall(material_floor, x=-3.65, y=i*2+4.01 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5); 
    }
}


function addAllWalls(){
    material_wall = new THREE.MeshPhongMaterial( { color: 0x88888 } );
    material_floor = new THREE.MeshPhongMaterial( { color: 0x005 } );
    material_ceiling = new THREE.MeshPhongMaterial( { color: 0x9D7BD1 } );

    addWall(material_wall, x=0, y=1 , z=0, x_axis=5, y_axis=1, z_axis=0.05);  
    addWall(material_wall, x=-3, y=1, z=1, x_axis=0.05, y_axis=1, z_axis=1);  
    addWall(material_wall, x=-3, y=1, z=4, x_axis=0.05, y_axis=1, z_axis=1); 
    addWall(material_wall, x=-3, y=1.8, z=2.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
    addWall(material_wall, x=0, y=1 , z=5, x_axis=5, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=5, y=1, z=1, x_axis=0.05, y_axis=1, z_axis=1); 
    addWall(material_wall, x=5, y=1, z=4, x_axis=0.05, y_axis=1, z_axis=1); 
    addWall(material_wall, x=5, y=1.8, z=2.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
    addWall(material_wall, x=-5, y=1 , z=6.45, x_axis=0.05, y_axis=1, z_axis=1.5); 
    addWall(material_wall, x=-4.05, y=1 , z=8, x_axis=1, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=-3, y=1 , z=9.95, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=-1.25, y=1 , z=12, x_axis=1.8, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=-3, y=1 , z=14.5, x_axis=0.05, y_axis=1, z_axis=2.5); 
    addWall(material_wall, x=3.25, y=1 , z=12, x_axis=1.7, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=1.05, y=1.8, z=12, x_axis=0.5, y_axis=0.2, z_axis=0.05); 
    addWall(material_wall, x=5, y=1, z=7, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=5, y=1, z=11, x_axis=0.05, y_axis=1, z_axis=1); 
    addWall(material_wall, x=5, y=1.8, z=9.5, x_axis=0.05, y_axis=0.2, z_axis=0.5); 
    addWall(material_wall, x=0.95, y=1 , z=17, x_axis=4, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=5, y=1, z=14.5 , x_axis=0.05, y_axis=1, z_axis=2.55);
    addWall(material_wall, x=-5, y=1 , z=-1.45, x_axis=0.05, y_axis=1, z_axis=1.5);
    addWall(material_wall, x=-4.05, y=1 , z=-2.95, x_axis=1, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=-3, y=1 , z=-6, x_axis=0.05, y_axis=1, z_axis=3.1);
    addWall(material_wall, x=5, y=1, z=-2, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=5, y=1, z=-7, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=5, y=1.8, z=-4.5, x_axis=0.05, y_axis=0.2, z_axis=0.5);
    addWall(material_wall, x=-1.25, y=1 , z=-9.05, x_axis=1.8, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=3.25, y=1 , z=-9.05, x_axis=1.7, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=1.05, y=1.8, z=-9.05, x_axis=0.5, y_axis=0.2, z_axis=0.05);
    addWall(material_wall, x=-3, y=1 , z=-10.5, x_axis=0.05, y_axis=1, z_axis=1.5); 
    addWall(material_wall, x=1, y=1 , z=-11.95, x_axis=4, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=5, y=1 , z=-10.5, x_axis=0.05, y_axis=1, z_axis=1.5); 
    addWall(material_wall, x=-3.7, y=1 , z=-11.95, x_axis=0.7, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=-4.4, y=1 , z=-14.4, x_axis=0.05, y_axis=1, z_axis=2.5); 
    addWall(material_wall, x=-1.95, y=1 , z=-16.9, x_axis=2.5, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=0.55, y=1 , z=-15.95, x_axis=0.05, y_axis=1, z_axis=1);
    addWall(material_wall, x=4, y=1 , z=-12.5, x_axis=0.05, y_axis=1, z_axis=0.5); 
    addWall(material_wall, x=4, y=1 , z=-14.5, x_axis=0.05, y_axis=1, z_axis=0.5); 
    addWall(material_wall, x=4, y=1.8, z=-13.5, x_axis=0.05, y_axis=0.2, z_axis=0.5);
    addWall(material_wall, x=2.3, y=1 , z=-15, x_axis=1.75, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=5.8, y=1 , z=-15, x_axis=1.75, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=6.8, y=1 , z=-9.05, x_axis=0.7, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=5.5, y=1.8, z=-9.05, x_axis=0.6, y_axis=0.2, z_axis=0.05);
    addWall(material_wall, x=7.5, y=1, z=-7, x_axis=0.05, y_axis=1, z_axis=2.1);
    addWall(material_wall, x=7.5, y=1 , z=-12, x_axis=0.05, y_axis=1, z_axis=3);
    addWall(material_wall, x=10.5, y=1 , z=-9.05, x_axis=3, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=13.5, y=1, z=-5.6, x_axis=0.05, y_axis=1, z_axis=3.5); 
    addWall(material_wall, x=8, y=1 , z=-2.1, x_axis=0.5, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=9, y=1.8, z=-2.1, x_axis=0.5, y_axis=0.2, z_axis=0.05); 
    addWall(material_wall, x=11.5, y=1 , z=-2.1, x_axis=2, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=7.5, y=1, z=-2.95, x_axis=0.05, y_axis=1, z_axis=0.9); 
    addWall(material_wall, x=7.5, y=1.8, z=-4.4, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
    addWall(material_wall, x=7.5, y=1, z=-0.05, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=7.5, y=1, z=5.1, x_axis=0.05, y_axis=1, z_axis=2.1); 
    addWall(material_wall, x=7.5, y=1.8, z=2.45, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
    addWall(material_wall, x=8, y=1 , z=7.15, x_axis=0.5, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=9, y=1.8, z=7.15, x_axis=0.5, y_axis=0.2, z_axis=0.05); 
    addWall(material_wall, x=11.5, y=1 , z=7.15, x_axis=2, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=13.5, y=1, z=2.5, x_axis=0.05, y_axis=1, z_axis=4.7); 
    addWall(material_wall, x=7.5, y=1, z=8.1, x_axis=0.05, y_axis=1, z_axis=0.9); 
    addWall(material_wall, x=7.5, y=1.8, z=9.55, x_axis=0.05, y_axis=0.2, z_axis=0.55); 
    addWall(material_wall, x=7.5, y=1, z=12.1, x_axis=0.05, y_axis=1, z_axis=2); 
    addWall(material_wall, x=10.6, y=1, z=15.55, x_axis=0.05, y_axis=1, z_axis=1.5); 
    addWall(material_wall, x=13.5, y=1, z=10.6, x_axis=0.05, y_axis=1, z_axis=3.5); 
    addWall(material_wall, x=10.5, y=1 , z=14.05, x_axis=3, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=7.8, y=1 , z=17, x_axis=2.8, y_axis=1, z_axis=0.05); 
    addWall(material_wall, x=6.8, y=1 , z=14.05, x_axis=0.65, y_axis=1, z_axis=0.05);
    addWall(material_wall, x=5.6, y=1.8, z=14.05, x_axis=0.6, y_axis=0.2, z_axis=0.05); 

    // stairs
    addWall(material_wall, x=6.7, y=0.011, z=16.25, x_axis=0.15, y_axis=0.01, z_axis=0.75);
    addWall(material_wall, x=7, y=0.05, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.3, y=0.15, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.6, y=0.25, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.9, y=0.35, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.2, y=0.45, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.5, y=0.55, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.8, y=0.65, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=9.1, y=0.75, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=9.4, y=0.85, z=16.25, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=10.05, y=0.95, z=15.5, x_axis=0.5, y_axis=0.05, z_axis=1.5); // platform

    addWall(material_wall, x=9.4, y=1.05, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=9.1, y=1.15, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.8, y=1.25, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.5, y=1.35, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=8.2, y=1.45, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.9, y=1.55, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.6, y=1.65, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7.3, y=1.75, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=7, y=1.85, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);
    addWall(material_wall, x=6.7, y=1.95, z=14.75, x_axis=0.15, y_axis=0.05, z_axis=0.75);


    //close block
    addWall(material_wall, x=6.7, y=3, z=15.5, x_axis=0.15, y_axis=1, z_axis=1.5);
    addWall(material_wall, x=8.05, y=1.5, z=15.5, x_axis=1.4, y_axis=3, z_axis=0.01);
    addPicture('images/closed.png', "front", 6.9, 2.4, 14.75);


    addWall(material_floor, x=5.25, y=0.01 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
    addWall(material_floor, x=2.25, y=0.01 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
    addWall(material_floor, x=-3.95, y=0.01 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
    addWall(material_floor, x=-3.95, y=0.01 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
    addWall(material_floor, x=3.75, y=0.01 , z=15.5, x_axis=6.75, y_axis=0.01, z_axis=1.5); 
    addWall(material_floor, x=-1.9, y=0.01 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
    addWall(material_floor, x=-3.65, y=0.01 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5);

    addWall(material_ceiling, x=5.25, y=1.99 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
    addWall(material_ceiling, x=2.25, y=1.99 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
    addWall(material_ceiling, x=-3.95, y=1.99 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
    addWall(material_ceiling, x=-3.95, y=1.99 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
    addWall(material_ceiling, x=1.77, y=1.99 , z=15.5, x_axis=4.78, y_axis=0.01, z_axis=1.5); 
    addWall(material_ceiling, x=-1.9, y=1.99 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
    addWall(material_ceiling, x=-3.65, y=1.99 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5);

    addWall(material_floor, x=5.25, y=2.01 , z=2.5, x_axis=8.22, y_axis=0.01, z_axis=11.5); 
    addWall(material_floor, x=2.25, y=2.01 , z=-12, x_axis=5.2, y_axis=0.01, z_axis=3);
    addWall(material_floor, x=-3.95, y=2.01 , z=-1.47, x_axis=1, y_axis=0.01, z_axis=1.5); 
    addWall(material_floor, x=-3.95, y=2.01 , z=6.47, x_axis=1, y_axis=0.01, z_axis=1.5);
    addWall(material_floor, x=1.77, y=2.01 , z=15.5, x_axis=4.78, y_axis=0.01, z_axis=1.5); 
    addWall(material_floor, x=-1.9, y=2.01 , z=-15.95, x_axis=2.45, y_axis=0.01, z_axis=0.97);
    addWall(material_floor, x=-3.65, y=2.01 , z=-13.5, x_axis=0.75, y_axis=0.01, z_axis=1.5);
}


async function addPicture(imageSrc, side, x, y, z){
    const img = new Image();

    img.src = imageSrc;
    img.decoding = 'async';
    img.decode().then(function() {

        THREE.ImageUtils.crossOrigin = ''; 
        var texture = THREE.ImageUtils.loadTexture( imageSrc );

        if(side == "front"){
            var cubeGeo = new THREE.BoxGeometry( 0.05, 1, img.width/img.height );
            var sides_materials = [
                new THREE.MeshBasicMaterial({ map: texture }),
                new THREE.MeshBasicMaterial({ map: texture }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
            ];
        } 
        else if(side == "lateral"){
            var sides_materials = [
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ map: texture }), 
                new THREE.MeshBasicMaterial({ map: texture })
            ];
            var cubeGeo = new THREE.BoxGeometry( img.width/img.height, 1, 0.05);
        }
        var cubeMat = new THREE.MeshBasicMaterial( { map: texture } );
        sides_materials = new THREE.MeshFaceMaterial( sides_materials );
        var cube = new THREE.Mesh( cubeGeo, sides_materials );
        cube.position.set( x, y, z );
        scene.add( cube );
    }).catch(function(error) {
        console.log(error.message);
        console.log(imageSrc);
    });
}


async function addLoading(imageSrc, side, x, y, z){
    const img = new Image();
    img.src = imageSrc;
    img.decoding = 'async';
    img.decode().then(function() {
        THREE.ImageUtils.crossOrigin = ''; 
        var texture = THREE.ImageUtils.loadTexture( imageSrc );

        if(side == "front"){
            var cubeGeo = new THREE.BoxGeometry( 0.01, 0.5, 0.5 );
            var sides_materials = [
                new THREE.MeshBasicMaterial({ map: texture }), 
                new THREE.MeshBasicMaterial({ map: texture }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
            ];
        } 
        else if(side == "lateral"){
            var sides_materials = [
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }),
                new THREE.MeshBasicMaterial({ map: texture }), 
                new THREE.MeshBasicMaterial({ map: texture }) 
            ];
            var cubeGeo = new THREE.BoxGeometry( 0.5, 0.5, 0.01);
        }
        var cubeMat = new THREE.MeshBasicMaterial( { map: texture } );
        sides_materials = new THREE.MeshFaceMaterial( sides_materials );
        var cube = new THREE.Mesh( cubeGeo, sides_materials );
        cube.position.set( x, y, z );
        scene.add( cube );
    }).catch(function(error) {
        console.log(error.message);
    });

}


async function getPixelsBalance(address){
    try {
        const aelf = new AElf(new AElf.providers.HttpProvider('https://explorer-test-side01.aelf.io/chain'));
        const wallet = AElf.wallet.createNewWallet();
        let nftContract = await aelf.chain.contractAt("ELF_2cLA9kJW3gdHuGoYNY16Qir69J3Nkn6MSsuYxRkUHbz4SG2hZr_AELF", wallet);

        let tokenIdsResult = await nftContract.GetAllTokensOfOwner.call({
            owner: address
        })

        if(!tokenIdsResult){
            console.log("No Nfts");
            return [];
        }
        else {
            let promisesTokensCid = [];
            let tokensTotalInfo = [];

            tokenIdsResult.tokensIds.map((tokenId) => promisesTokensCid.push(nftContract.GetTokenURI.call({
                value: tokenId
            })))

            let resultTokensCid = await Promise.all(promisesTokensCid)
            let promisesTokensMetadata = [];

            resultTokensCid.map((item) => promisesTokensMetadata.push("https://cloudflare-ipfs.com/ipfs/" + item.uri));
            let resultTokensMetadata = await Promise.all(promisesTokensMetadata.map((cid) => {
                return fetch(cid).then((response) => response.json());
            }))
            
            resultTokensMetadata.map((token, index) => tokensTotalInfo.push({
                "token_id" : tokenIdsResult.tokensIds[index],
                "token_image" : token.image,
                "token_name" : `Aelf Pixel #${tokenIdsResult.tokensIds[index]}`
            }));

            return tokensTotalInfo;
        }
    } catch(e){
        throw new Error(e)
    }

}


function addWindows(){
    const arrayWindow = [
        ["front", -5.05, 1, -1.48],
        ["front", -5.05, 1, 6.51],
        ["front", -3.05, 1, -7.25],
        ["front", -4.45, 1, -14.53],
        ["front", -3.05, 1, 12.5],
        ["front", -5.05, 3, -1.48],
        ["front", -5.05, 3, 6.51],
        ["front", -3.05, 3, -7.25],
        ["front", -4.45, 3, -14.53],
        ["front", -3.05, 3, 12.5]
    ]

    for(var i=0; i<arrayWindow.length; i++){
        addPicture('images/window.png', arrayWindow[i][0], arrayWindow[i][1], arrayWindow[i][2], arrayWindow[i][3])
    }

    addPicture('images/hackerlink.jpg', "front", -3.1, 0.85, 1);
    addPicture('images/aelf_Logo.jpg', "front", -3.1, 0.85, 4);
}

function addNFT(arrayNFT){
    const arrayPictures = [
        ["lateral", -0.65, 1, 0.05],
        ["lateral", -0.65, 1, 4.95],
        ["lateral", 2.6, 1, 0.05],
        ["lateral", 2.6, 1, 4.95],
        ["front", 7.45, 1, -1],
        ["front", 5.05, 1, -1],
        ["front", 7.45, 1, 5.9],
        ["front", 5.05, 1, 5.9],
        ["front", 7.45, 1, 12.2],
        ["front", 5.05, 1, 12.2],
        ["front", 7.45, 1, -7],
        ["front", 5.05, 1, -7],
        ["front", 13.43, 1, 0.5],
        ["front", 13.44, 1, 5],
        ["lateral", 11.4, 1, 7.1],
        ["lateral", 11.4, 1, -2.04],
        ["front", 7.55, 1, 5.28],
        ["front", 7.55, 1, -0.06],
        ["lateral", 11.4, 1, 7.211],
        ["front", 13.43, 1, 10.65],
        ["lateral", 10.533, 1, 14],
        ["front", 7.55, 1, 11.7],
        ["lateral", 11.4, 1, -2.151],
        ["front", 13.43, 1, -5.27],
        ["lateral", 10.366, 1, -8.97],
        ["front", 7.55, 1, -7.011],
        ["front", 4.95, 1, 6.95],
        ["lateral", 2.05, 1, 5.05],
        ["lateral", -2.35, 1, 5.05],
        ["lateral", 3.37, 1, 11.95],
        ["lateral", -1.23, 1, 11.95],
        ["front", -2.95, 1, 10.02],
        ["front", -4.95, 1, 6.51],
        ["front", 4.95, 1, -1.88],
        ["front", 4.95, 1, -6.94],
        ["lateral", 2.05, 1, -0.05],
        ["lateral", -2.35, 1, -0.05],
        ["lateral", 3.31, 1, -9],
        ["lateral", -1.29, 1, -9],
        ["front", -2.95, 1, -6.2],
        ["front", -4.95, 1, -1.48],
        ["lateral", 3.37, 1, 12.05],
        ["lateral", -1.23, 1, 12.05],
        ["front", 4.95, 1, 14.615],
        ["front", -2.95, 1, 14.615],
        ["lateral", 1, 1, 16.95],
        ["lateral", 3.31, 1, -9.1],
        ["lateral", -1.29, 1, -9.1],
        ["lateral", 3.31, 1, -11.89],
        ["lateral", -1.29, 1, -11.89],
        ["lateral", -2.3, 1, -12],
        ["lateral", 1.1, 1, -12],
        ["front", -4.35, 1, -14.7],
        ["lateral", -1.92, 1, -16.85],
        ["lateral", 2.36, 1, -14.95],
        ["lateral", 5.8, 1, -14.95],
        ["front", 7.45, 1, -11.99],
    ];

    let countMyNft = arrayNFT.length;
    if(countMyNft >= arrayPictures.length){
        countMyNft = arrayPictures.length;
    }

    info_log_left.innerHTML = ` 
    <b>- Address:</b> ${walletAddress.value}<br>
    <b>- Aelf Pixels count:</b> ${arrayNFT.length} NFTs<br>
    <b>- Gallery max. capacity:</b> 57 NFTs<br> `;

    for(var i=0; i<countMyNft; i++){
        if(arrayNFT[i].token_image.substr(0,7) == "ipfs://"){
            arrayNFT[i].token_image = arrayNFT[i].token_image.replace("ipfs://", 'https://cf-ipfs.com/ipfs/');
        } else {
            arrayNFT[i].token_image = "https://cf-ipfs.com/ipfs/" + arrayNFT[i].token_image;
        }

        addLoading('images/loading.png', arrayPictures[i][0], arrayPictures[i][1], arrayPictures[i][2], arrayPictures[i][3]);
        addPicture(arrayNFT[i].token_image, arrayPictures[i][0], arrayPictures[i][1], arrayPictures[i][2], arrayPictures[i][3]);
        addCanvas(`${arrayNFT[i].token_name}`, arrayPictures[i][0], arrayPictures[i][1], arrayPictures[i][3]);
    }

    for(var i=countMyNft; i<arrayPictures.length; i++){
        addPicture('images/null.png', arrayPictures[i][0], arrayPictures[i][1], arrayPictures[i][2], arrayPictures[i][3],)
    }
}


var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}



function addCanvas(title, side, x, z){
    var geometry1, texture1, mesh1, material1, ctx, canvas ;

    if(side == "front"){
        canvas = createHiDPICanvas(200, 40,1);
        ctx = canvas.getContext('2d');
        ctx.font = '15pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, canvas.width / 2, 20);
        texture1 = new THREE.Texture(canvas);
        texture1.needsUpdate = true;
        material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide});
        geometry1 = new THREE.PlaneGeometry( 1, 0.2);
        mesh1 = new THREE.Mesh( geometry1, material1 );
        mesh1.position.set(x+0.005, 0.3, z);
        mesh1.rotation.y = Math.PI / 2;
        scene.add( mesh1 );

        canvas = createHiDPICanvas(200, 40,1);
        ctx = canvas.getContext('2d');
        ctx.font = '15pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, canvas.width / 2, 20);
        texture1 = new THREE.Texture(canvas);
        texture1.needsUpdate = true;
        material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide});
        geometry1 = new THREE.PlaneGeometry( 1, 0.2);
        mesh1 = new THREE.Mesh( geometry1, material1 );
        mesh1.position.set(x-0.01, 0.3, z);
        mesh1.rotation.y = -Math.PI / 2;
        scene.add( mesh1 );

    } else if(side == "lateral"){
        canvas = createHiDPICanvas(200, 40,1);
        ctx = canvas.getContext('2d');
        ctx.font = '15pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, canvas.width / 2, 20);
        texture1 = new THREE.Texture(canvas);
        texture1.needsUpdate = true;
        material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide});
        geometry1 = new THREE.PlaneGeometry( 1, 0.2);
        mesh1 = new THREE.Mesh( geometry1, material1 );
        mesh1.position.set(x, 0.3, z+0.01);
        scene.add( mesh1 );

        canvas = createHiDPICanvas(200, 40,1);
        ctx = canvas.getContext('2d');
        ctx.font = '15pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, canvas.width / 2, 20);
        texture1 = new THREE.Texture(canvas);
        texture1.needsUpdate = true;
        material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide});
        geometry1 = new THREE.PlaneGeometry( 1, 0.2);
        mesh1 = new THREE.Mesh( geometry1, material1 );
        mesh1.position.set(x, 0.3, z-0.02);
        mesh1.rotation.y = Math.PI;
        scene.add( mesh1 );
    }
}