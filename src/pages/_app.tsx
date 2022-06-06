import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../next/css/bootswatch-flatly.css';
import '../next/css/style.css';

if (typeof window !== 'undefined') {
  NProgress.configure({ showSpinner: true });

  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });

  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });

  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
