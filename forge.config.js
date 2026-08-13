export default {
  packagerConfig: {
    name: 'Ampel-School',
    icon: './assets/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'AmpelSchool',
        setupIcon: './assets/icon.ico',
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
      },
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