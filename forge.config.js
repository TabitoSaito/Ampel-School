export default {
  packagerConfig: {
    name: 'Ampel-School',
    icon: './assets/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        name: 'Ampel School',
        outputName: "setup",
        manufacturer: 'Dominik Hoelzl',
        language: 1031,
        ui: {
          chooseDirectory: true,   
      }
    }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'TabitoSaito',
          name: 'Ampel-School'
        },
        prerelease: false,
        draft: true // Erstellt zuerst einen Entwurf, den du prüfen kannst
      }
    }
  ]
};