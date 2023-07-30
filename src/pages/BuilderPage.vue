<script setup>
import {ref} from "vue";
import FieldsTable from "components/FieldsTable.vue";

const result = ref('');
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Builder</div>
          <div class="text-subtitle2">By Joabson Arley</div>
        </q-card-section>
        <hr/>
        <q-card-section>
          <fields-table @generate:code="result = $event"></fields-table>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-input
                  filled
                  label="Result"
                  type="textarea"
                  autogrow
                  readonly
                  v-model="result"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>

</style>
