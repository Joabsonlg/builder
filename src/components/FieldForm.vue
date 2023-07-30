<template>
  <q-dialog v-model="localShow" persistent full-width @beforeHide="clearField">
    <q-card>
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Field
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
                filled
                label="Field name"
                v-model="localField.name"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select filled :options="options" label="Component" v-model="localField.component"
                      @update:model-value="prepareParams()"/>
          </div>
          <div class="col-12" v-for="(param, index) in localField.params" :key="index">
            <q-input
                filled
                :label="param.name"
                v-model="param.value"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="negative" label="Cancel"/>
        <q-btn flat color="primary" label="Save" @click="addField()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useQuasar} from "quasar";
import {fetchInLS, saveInLS} from "src/js/storageHelper";
import {v4 as uuidv4} from "uuid";

export default defineComponent({
  name: 'FieldForm',
  props: {
    field: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  setup(props, {emit}) {
    const $q = useQuasar()
    const localShow = ref(props.show)
    const localField = ref({...props.field})
    const param = ref({name: ''})
    const formRef = ref(null)

    const paramsColumns = [
      {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left',
        sortable: true
      },
      {
        name: 'action',
        label: 'Action',
        field: 'action',
        align: 'center',
        sortable: false
      }
    ]

    watch(localShow, (value) => {
      if (value !== props.show) {
        emit('update:show', value)
      }
    }, {immediate: true})

    watch(localField, (value) => {
      if (value !== props.field) {
        emit('update:field', value)
      }
    }, {immediate: true})

    watch(() => props.show, (value) => {
      if (value !== localShow.value) {
        localShow.value = value
      }
    })

    watch(() => props.field, (value) => {
      if (JSON.stringify(value) !== JSON.stringify(localField.value)) {
        localField.value = {...value}
      }
    })

    const addField = () => {
      if (!localField.value.id) {
        localField.value.id = uuidv4();
      }
      emit('add:field', localField.value)
    }

    const removeField = (index) => {
      fields.splice(index, 1);
      saveInLS('fields', fields);
    }

    const removeRow = (index) => {
      localField.value.params.splice(index, 1)
    }

    const saveComponent = () => {
      if (formRef.value.validate()) {
        emit('update:field', localField.value)
        localShow.value = false
      }
    }

    const prepareParams = () => {
      const componentId = localField.value.component.value;
      const component = components.find(component => component.id === componentId);

      localField.value.params = component.params.map(param => {
        return {
          name: param.name,
          value: ''
        }
      });
    }

    const components = fetchInLS('components', true);

    const clearField = () => {
      localField.value = {
        name: '',
        component: '',
        params: []
      }
    }

    return {
      localShow,
      localField,
      paramsColumns,
      removeRow,
      param,
      saveComponent,
      formRef,
      prepareParams,
      components,
      clearField,
      addField,
    }
  }
})
</script>
