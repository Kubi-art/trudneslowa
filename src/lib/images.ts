// Zdjęcia wygenerowane w Higgsfield (GPT Image 2.5). Wersje .webp mają pełną rozdzielczość i ważą ok. 100 KB.
const cdn = "https://d8j0ntlcm91z4.cloudfront.net/user_3BgV3D02ERSvV45hps76tOC3xRW";
const img = (id: string) => `${cdn}/hf_20261021_${id}_min.webp`;

export const images = {
  // stare zdjęcie: neutralne dłonie wpisujące kod
  dialing: `${cdn}/hf_20261018_133023_15d70863-b5e2-4c0f-bc18-d9b2755fa3ec.png`,

  city: img("030258_5849c689-531b-4782-bc24-d2084985e236"),
  bedside: img("030259_81a4cf70-92d9-4648-a0fd-6b62d75accbc"),
  office: img("030257_03415247-9fb1-4a90-917c-660abc62cbc6"),
  hairdresser: img("030259_41f12d1e-3567-49fd-8419-956a3d493065"),
  mechanic: img("030257_cfc5cd51-d651-472a-8069-5460504dc7f3"),
  dentist: img("030258_7df0af54-f3a4-412a-b79c-11421001de56"),
  bakery: img("030257_54937f0d-f7b8-441b-bcff-b906126fbf4c"),
  electrician: img("030256_37a5dbb8-8c20-4074-890f-7b11e8bc7e0a"),
  physio: img("030259_0e13b3d0-c6e9-4c14-9a3b-8e8f1af51892"),
  vet: img("030257_d4d4f909-c842-45ed-9963-8d9cfdaaf8c0"),
  driver: img("030258_3f9a56cf-9bc1-4712-a240-3ab8f4502980"),
  kitchen: img("030257_e282face-99ae-4bd1-99eb-61cbe9c7bb6d"),
};
