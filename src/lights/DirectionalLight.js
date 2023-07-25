class DirectionalLight {

    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, rotate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

         //https://glmatrix.net/docs/module-mat4.html
         
        // Model transform
        /* mat4.translate(out, a, v);
        out is the output; a is the input; v is the 3D vector to translate by
        */
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
        mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
        mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);
        mat4.scale(modelMatrix, modelMatrix, scale);

        // View transform
        /* mat4.lookAt(out, lp, fp, lu);
        out is the output; lp represents the position of the camera; 
        fp represents the point in 3D space that the camera is looking at; 
        lu represents the "up" direction for the camera, usually [0, 1, 0] for Y-up coordinates.
        */
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);

        // Projection transform
        var r = 200;
        var l = -r;
        var t = 200;
        var b = -t;

        var n = 0.01;
        var f = 500;
        
        // n is the near clipping plane, f is the far clipping plane.
        mat4.ortho(projectionMatrix, l, r, b, t, n, f);



        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);  
        mat4.multiply(lightMVP, lightMVP, modelMatrix);  
    
        return lightMVP;  
    }
}
