<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <q-table
          title="Fields"
          :rows="fields"
          :columns="columns"
          row-key="name"
          :filter="filter"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-btn class="q-ml-sm" color="secondary" icon="construction" @click="createCode()">
            <q-tooltip>
              Generate code
            </q-tooltip>
          </q-btn>
          <q-btn class="q-ml-sm" color="secondary" icon="fas fa-plus" @click="show = true">
            <q-tooltip>
              Add field
            </q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="component" :props="props">
              {{ props.row.component.label }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                  color="primary"
                  icon-right="fas fa-edit"
                  no-caps
                  flat
                  dense
                  @click="prepareToEdit(props.row)"
              />
              <q-btn
                  color="negative"
                  icon-right="fas fa-trash-alt"
                  no-caps
                  flat
                  dense
                  @click="removeRow(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <field-form :show="show" :field="field" :options="options" @update:show="show = $event"
                  @update:field="field = $event" @add:field="addField($event)"
      ></field-form>
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive, ref} from 'vue'
import {generateCode} from "src/js/CodeGenerator";
import FieldForm from "components/FieldForm.vue";
import {fetchInLS, saveInLS} from "src/js/storageHelper";

export default defineComponent({
  name: 'FieldsTable',
  components: {FieldForm},
  setup(props, {emit}) {
    const filter = ref('');
    const show = ref(false);

    let fields = reactive(fetchInLS('fields', true));

    const removeRow = (row) => {
      const index = fields.indexOf(row)
      fields.splice(index, 1)
      saveInLS('fields', fields);
    }

    const createCode = () => {
      console.log('Start code generation...')
      const code = generateCode(fields);
      console.log(`Code generated.`)
      emit('generate:code', code);
    }

    const components = fetchInLS('components', true);

    const options = components.map(component => {
      return {
        label: component.name,
        value: component.id
      }
    });

    let field = ref({
      name: 'teste',
      componentId: '',
      params: []
    });

    const prepareToEdit = (row) => {
      field.value = {...row};
      show.value = true;
    }

    const columns = [
      {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left'
      },
      {
        name: 'component',
        label: 'Component',
        field: 'component',
        align: 'left'
      },
      {
        name: 'action',
        label: 'Action',
        field: 'action',
        align: 'center'
      }
    ]

    const addField = (field) => {
      const index = fields.findIndex(f => f.id === field.id);
      if (index!== -1) {
        fields[index] = field;
      } else {
        fields.push(field);
      }
      saveInLS('fields', fields);
      show.value = false;
    }

    return {
      removeRow,
      fields,
      columns,
      filter,
      createCode,
      show,
      options,
      prepareToEdit,
      generateCode,
      field,
      addField
    }
  }
})
</script>
