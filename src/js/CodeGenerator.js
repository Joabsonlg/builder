import {fetchInLS} from "src/js/storageHelper";

const generateCode = (fields) => {
    const components = fetchInLS('components', true);
    let code = '';

    fields.forEach(field => {
        const componentId = field.component.value;
        const component = components.find(c => c.id === componentId);

        let template = component.formTemplate;

        field.params.forEach(param => {
            template = template.replace(`\$${param.name}`, `'${param.value}'`);
        });

        code += template + '\n';
    });

    return code;
}

export {generateCode}
