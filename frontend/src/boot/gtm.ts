import { boot } from 'quasar/wrappers';
import { createGtm } from '@gtm-support/vue-gtm';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  console.log('booting gtm');
  app.use(
    createGtm({
      id: 'GTM-WPM5HCX',
      defer: false,
      enabled: true,
      debug: true,
      loadScript: true,
      vueRouter: router,
      trackOnNextTick: false,
    })
  );
});
