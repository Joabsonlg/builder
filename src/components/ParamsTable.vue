<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <q-table
        title="Params"
        :rows="localRows"
        :columns="localColumns"
        row-key="name"
        :filter="filter"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="action" :props="props">
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
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  name: 'ParamsTable',
  props: {
    rows: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  setup(props, {emit}) {
    const localRows = ref(props.rows);
    const localColumns = ref(props.columns);
    const filter = ref('');

    watch(() => props.rows, (value) => {
      localRows.value = value
    })

    watch(() => props.columns, (value) => {
      localColumns.value = value
    })

    const removeRow = (row) => {
      const index = localRows.value.indexOf(row)
      emit('update:remove', index)
    }

    return {
      removeRow,
      localRows,
      localColumns,
      filter
    }
  }
})
</script>
