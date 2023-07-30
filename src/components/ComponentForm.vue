<template>
  <q-dialog v-model="localShow" persistent full-width>
    <q-card>
      <q-form @submit="saveComponent" ref="formRef">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Component {{ localComponent.name }}
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                filled
                label="Component name"
                v-model="localComponent.name"
                :rules="[val => !!val || 'Required']"
              />
            </div>
            <div class="col-12">
              <q-separator/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6 text-weight-regular">
                Params
              </div>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-11">
              <q-input
                filled
                label="Nome do parâmetro"
                v-model="param.name"
                @keydown.enter="addRow()"
              />
            </div>
            <div class="col-12 col-md-1 flex justify-center">
              <q-btn color="secondary" icon="add" @click="addRow()">
                <q-tooltip>
                  Adicionar campo
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col-12">
              <q-separator/>
            </div>
            <div class="col-12">
              <ParamsTable :rows="localComponent.params" :columns="paramsColumns" @update:remove="removeRow($event)"/>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-input
                type="textarea"
                autogrow
                filled
                v-model="localComponent.formTemplate"
                label="Template"
                lazy-rules
                :rules="[val => !!val || 'Required']"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="negative" label="Cancel"/>
          <q-btn flat color="primary" label="Save" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useQuasar} from "quasar";
import ParamsTable from "components/ParamsTable.vue";

export default defineComponent({
  name: 'ComponentForm',
  components: {ParamsTable},
  props: {
    component: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  setup(props, {emit}) {
    const $q = useQuasar()
    const localShow = ref(props.show)
    const localComponent = ref({...props.component})
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
      emit('update:show', value)
    })

    watch(() => props.show, (value) => {
      localShow.value = value
    })

    watch(() => props.component, (value) => {
      localComponent.value = {...value}
    })

    const removeRow = (index) => {
      localComponent.value.params.splice(index, 1)
    }

    const addRow = () => {
      event.preventDefault()
      if (param.value.name === '') {
        $q.notify({
          color: 'negative',
          message: 'O nome do parâmetro não pode ser vazio!',
          icon: 'report_problem',
          position: 'top-right'
        })
        return
      }
      if (param.value.name.indexOf(' ') !== -1) {
        $q.notify({
          color: 'negative',
          message: 'O parâmetro não pode ter espaços!',
          icon: 'report_problem',
          position: 'top-right'
        })
        return
      }
      localComponent.value.params.push({...param.value});
      param.value.name = ''
    }

    const saveComponent = () => {
      if (formRef.value.validate()) {
        emit('update:component', localComponent.value)
        localShow.value = false
      }
    }

    return {
      localShow,
      localComponent,
      paramsColumns,
      removeRow,
      addRow,
      param,
      saveComponent,
      formRef
    }
  }
})
</script>
