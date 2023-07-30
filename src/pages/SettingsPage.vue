<script setup>
import {getCurrentInstance, reactive, ref, watch} from 'vue'

import ComponentForm from "components/ComponentForm.vue";
import {downloadJSON} from "src/js/fileHelper";
import {fetchInLS, saveInLS} from "src/js/storageHelper";
import {v4 as uuidv4} from 'uuid';
import {useQuasar} from "quasar";

const filter = ref('');
const show = ref(false);
const myFileInput = ref(null);
const $q = useQuasar();

let component = reactive({
  id: '2a673b51-ee6c-4c9a-8848-e22736e6c7cc',
  name: 'Input text',
  formTemplate: `<div th:replace="fragments/components/form/input-text :: input-text('$label',
'$info', '$field', '$columns', '$id')"></div>`,
  params: [{
    name: 'field'
  }]
});

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
  },
]

let rows = fetchInLS('components', true);

const exportTable = () => {
  downloadJSON(rows, 'components.json')
}

const updateComponent = (value) => {
  component = {...value};
  if (value.id === '') {
    value.id = uuidv4();
    rows.push(value);
  } else {
    const index = rows.findIndex(row => row.id === value.id);
    rows.splice(index, 1, value);
  }
  rows = reactive(saveInLS('components', rows, true));
  show.value = false;
}

const prepareToAddComponent = () => {
  component = {
    id: '',
    name: '',
    formTemplate: '',
    params: []
  }
  show.value = true;
}

const prepareToEditComponent = (value) => {
  component = {...value};
  show.value = true;
}

const deleteComponent = (value) => {
  const index = rows.findIndex(row => row.id === value.id);
  rows.splice(index, 1);
  rows = reactive(saveInLS('components', rows, true));
}

const file = ref(null);

const getFile = () => {
  myFileInput.value.$el.click()
}

watch(file, (value) => {
  if (value) {
    const reader = new FileReader();
    reader.readAsText(value);
    reader.onload = () => {
      const json = JSON.parse(reader.result);
      if (json) {
        rows = reactive(saveInLS('components', json, true));
        $q.notify({
          progress: true,
          color: 'positive',
          message: 'Arquivo importado com sucesso! A página será recarregada.',
          icon: 'cloud_done',
          timeout: 1000,
          onDismiss() {
            window.location.reload();
          }
        });
      } else {
        onRejected(value);
      }
    }
  }
});

const onRejected = (files) => {
  $q.notify({
    color: 'negative',
    message: 'Arquivo inválido!',
    icon: 'report_problem'
  })
}
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Settings</div>
          <div class="text-subtitle2">By Joabson Arley</div>
        </q-card-section>
        <hr/>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-table
                  title="Components"
                  :rows="rows"
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
                  <q-file
                      v-model="file"
                      label="Pick one file"
                      filled
                      accept=".json"
                      ref="myFileInput"
                      @rejected="onRejected"
                      style="max-width: 300px; display: none"
                  />
                  <q-btn
                      color="secondary"
                      class="q-ml-sm"
                      icon-right="fas fa-plus"
                      no-caps
                      @click="prepareToAddComponent()"
                  >
                    <q-tooltip>
                      Adicionar componente
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                      color="secondary"
                      class="q-ml-sm"
                      icon-right="fas fa-file-import"
                      no-caps
                      @click="getFile"
                  >
                    <q-tooltip>
                      Importar dados
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                      color="secondary"
                      class="q-ml-sm"
                      icon-right="fas fa-file-export"
                      no-caps
                      @click="exportTable"
                  >
                    <q-tooltip>
                      Exportar dados
                    </q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="name" :props="props">
                      {{ props.row.name }}
                    </q-td>
                    <q-td key="action" :props="props">
                      <q-btn
                          color="primary"
                          icon-right="fas fa-edit"
                          no-caps
                          flat
                          dense
                          @click="prepareToEditComponent(props.row)"
                      />
                      <q-btn
                          color="negative"
                          icon-right="fas fa-trash-alt"
                          no-caps
                          flat
                          dense
                          @click="deleteComponent(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <component-form
        :component="component"
        :show="show"
        @update:show="show = $event"
        @update:component="updateComponent($event)"
    >
    </component-form>
  </q-page>
</template>

<style scoped>

</style>
