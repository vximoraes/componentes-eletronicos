import js from '@eslint/js';

export default [
    js.configs.recommended, // Inclui diretamente a configuração recomendada para JavaScript
    {
        plugins: {}, // Flat Config requer que "plugins" seja um objeto
        rules: {
            semi: ['error', 'always'], // Exige ponto e vírgula no final das linhas
        },
    },
];