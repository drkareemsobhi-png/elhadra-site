/* ============================================================================
   Meta Pixel — الحضرة
   ID: 423846121992439  (El Hadra's Pixel)

   الملف ده بيتحمّل في index.html و order.html.
   ممنوع نبعت أي بيانات شخصية (اسم / تليفون / عنوان) لميتا —
   Advanced Matching مقفول عمدًا، والـ Purchase بيتبعت بالقيمة بس.

   الأحداث:
     PageView          — كل صفحة
     Src_<المصدر>      — أول صفحة في الجلسة، باسم ?src= (أو fb_click / direct)
     Contact           — ضغط على واتساب أو على رقم التليفون
     AddToCart         — زيادة صنف في صفحة الأوردر
     InitiateCheckout  — فتح شيت البيانات
     Purchase          — الأوردر اتأكد وصوله من الباك إند (كاش عند الاستلام)
   ============================================================================ */
(function (w, d) {
  'use strict';

  var PIXEL_ID = '423846121992439';

  /* snippet ميتا الرسمي */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (w,d,'script','https://connect.facebook.net/en_US/fbevents.js');

  w.fbq('init', PIXEL_ID);
  w.fbq('track', 'PageView');

  /* مصدر الزيارة — ميتا بتشيل ?src= من عنوان الـ PageView، فبنبعت المصدر كاسم حدث
     (Src_fb_auto · Src_fb_kw · …) عشان يتعدّ لكل مصدر لوحده من stats?aggregation=event.
     مرة واحدة في الجلسة (أول صفحة دخلها). من غير src: fbclid = Src_fb_click، غير كده Src_direct.
     الاسم بيتنضف لحروف صغيرة وأرقام و_ بس. مفيش أي بيانات شخصية. */
  try {
    var seen = false;
    try { seen = w.sessionStorage.getItem('ehSrcSent') === '1'; } catch (e) {}
    if (!seen) {
      var q = new URLSearchParams(w.location.search);
      var s = (q.get('src') || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 40);
      if (!s) s = q.get('fbclid') ? 'fb_click' : 'direct';
      var page = /order\.html/.test(w.location.pathname) ? 'order' : 'home';
      w.fbq('trackCustom', 'Src_' + s, { page: page });
      try { w.sessionStorage.setItem('ehSrcSent', '1'); } catch (e) {}
    }
  } catch (err) {}

  /* helper آمن — لو الـ pixel اتبلوك، الموقع يفضل شغال عادي */
  function track(name, params) {
    try { w.fbq('track', name, params || {}); } catch (err) {}
  }
  w.ehPixel = { track: track, id: PIXEL_ID };

  /* واتساب + تليفون = Contact. delegation عشان يشتغل على أي لينك يتضاف بعدين */
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) {
      track('Contact', { content_name: 'whatsapp' });
    } else if (href.indexOf('tel:') === 0) {
      track('Contact', { content_name: 'phone_call' });
    }
  }, true);

})(window, document);
