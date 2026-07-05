import { computed, ref, watch } from "vue";

const STORAGE_KEY = "greenie-settings";

const defaultIndividualPrivacy = {
  hideOnlineStatus: false,
  anonymizeMessages: false,
  hideProfileDetails: false,
  shareReadReceipts: true
};

const strictPrivacyValues = {
  hideOnlineStatus: true,
  anonymizeMessages: true,
  hideProfileDetails: true,
  shareReadReceipts: false
};

const defaultSettings = {
  profile: {
    displayName: ""
  },
  design: {
    theme: "green"
  },
  privacy: {
    strictMode: false,
    individual: { ...defaultIndividualPrivacy }
  }
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultSettings);
    }

    const parsed = JSON.parse(raw);
    return {
      profile: { ...defaultSettings.profile, ...parsed.profile },
      design: { ...defaultSettings.design, ...parsed.design },
      privacy: {
        strictMode: Boolean(parsed.privacy?.strictMode),
        individual: {
          ...defaultIndividualPrivacy,
          ...parsed.privacy?.individual
        }
      }
    };
  } catch {
    return structuredClone(defaultSettings);
  }
}

const settings = ref(loadSettings());

watch(
  settings,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    applyTheme(value.design.theme);
  },
  { deep: true }
);

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function useSettings() {
  const effectivePrivacy = computed(() => {
    if (settings.value.privacy.strictMode) {
      return {
        strictMode: true,
        ...strictPrivacyValues
      };
    }

    return {
      strictMode: false,
      ...settings.value.privacy.individual
    };
  });

  function setStrictPrivacy(enabled) {
    settings.value.privacy.strictMode = enabled;
  }

  function setRegularPrivacy(enabled) {
    if (enabled) {
      settings.value.privacy.strictMode = false;
    }
  }

  function updateIndividualPrivacy(key, value) {
    if (settings.value.privacy.strictMode) {
      return;
    }

    settings.value.privacy.individual[key] = value;
  }

  function updateProfile(partial) {
    settings.value.profile = {
      ...settings.value.profile,
      ...partial
    };
  }

  function updateDesign(partial) {
    settings.value.design = {
      ...settings.value.design,
      ...partial
    };
  }

  applyTheme(settings.value.design.theme);

  return {
    settings,
    effectivePrivacy,
    setStrictPrivacy,
    setRegularPrivacy,
    updateIndividualPrivacy,
    updateProfile,
    updateDesign
  };
}
