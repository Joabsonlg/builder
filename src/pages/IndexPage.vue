<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Home</div>
          <div class="text-subtitle2">By Joabson Arley</div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2">
            <p>
              This is a simple builder, where you can create your own form with the components you want.
            </p>
            <p>
              You can add, edit and remove components and fields.
            </p>
            <p>
              You can also import and export your data.
            </p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
