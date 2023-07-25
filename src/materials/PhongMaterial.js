class PhongMaterial extends Material {

    constructor(color, specular, light, translate, rotate, scale, lightIndex, vertexShader, fragmentShader) {
        let lightMVP = light.CalcLightMVP(translate, rotate, scale);
        let lightIntensity = light.mat.GetIntensity();

        super({
            // Phong
            'uSampler': { type: 'texture', value: color },
            'uKs': { type: '3fv', value: specular },
            'uLightIntensity': { type: '3fv', value: lightIntensity },
            // Shadow
            'uShadowMap': { type: 'texture', value: light.fbo },
            'uLightMVP': { type: 'matrix4fv', value: lightMVP },

        }, [], vertexShader, fragmentShader, null, lightIndex);
    }
}

async function buildPhongMaterial(color, specular, light, translate, rotate, scale, lightIndex, vertexPath, fragmentPath) {

    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new PhongMaterial(color, specular, light, translate, rotate, scale, lightIndex, vertexShader, fragmentShader);

}