<template>
  <q-dialog
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    @hide="$emit('afterClose')"
  >
    <q-card class="create-channel-modal" flat bordered>
      <q-card-section>
        <h2 class="text-h5 q-ma-none">{{ t('create_channel.title') }}</h2>

        <q-form
          class="create-channel-modal__form"
          @submit.prevent="handleCreateChannel"
        >
          <q-input
            :label="t('create_channel.fields.name.label')"
            v-model="channelName"
            standout
            :rules="channelNameRules"
          />

          <q-select
            :label="t('create_channel.fields.type.label')"
            v-model="channelType"
            :options="options"
            emit-value
            map-options
            standout
            :rules="channelVisibilityRules"
          />

          <div class="create-channel-modal__buttons">
            <q-btn
              color="secondary"
              :label="t('create_channel.cancel')"
              @click="$emit('close')"
              outline
            />

            <q-btn
              type="submit"
              color="primary"
              :label="t('create_channel.submit')"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ValidationRule } from 'quasar';
import { useMainStore } from 'stores/main';
import { Channel, ChannelType } from 'src/contracts';

const { isOpen, type } = defineProps<{
  isOpen: boolean;
  type: Channel['type'] | undefined;
}>();

const { t } = useI18n();
const mainStore = useMainStore();

const channelName = ref<string>('');
const channelType = ref<Channel['type'] | undefined>(type);

const loading = ref(false);

const options = [
  { label: t('channel_types.public'), value: ChannelType.Public },
  { label: t('channel_types.private'), value: ChannelType.Private },
];

const handleCreateChannel = () => {
  loading.value = true;

  setTimeout(() => {
    mainStore.createChannel(channelName.value, channelType.value!);

    loading.value = false;
    emit('close');
  }, 1000);
};

const channelNameRules: ValidationRule<string>[] = [
  (val) => !!val || t('create_channel.fields.name.validation.required'),
  (val) => val.length >= 3 || t('create_channel.fields.name.validation.min'),
  (val) => val.length <= 30 || t('create_channel.fields.name.validation.max'),
];

const channelVisibilityRules: ValidationRule<Channel['type'] | undefined>[] = [
  (val) => !!val || t('create_channel.fields.type.validation.required'),
];

const emit = defineEmits<{
  close: [];
  afterClose: [];
}>();

defineOptions({
  name: 'CreateChannelModal',
});
</script>

<style scoped lang="scss">
.create-channel-modal {
  width: 100%;
  max-width: 20rem;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}
</style>
