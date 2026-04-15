jQuery(function ($) {

  const bars = $(".th-sticky-cart");

  if (!bars.length) return;

  const animClasses = ["slide", "fade", "bounce"];

  /* -------------------
   * SCROLL FUNCTION
   * ------------------- */
  const handleScroll = () => {

    bars.each(function () {

      const bar = $(this);

      const trigger = parseInt(bar.data("scroll")) || 20;
      const anim = bar.data("animation") || "slide";
      const position = bar.hasClass("th-top") ? "top" : "bottom";

      const scrollPercent =
        (window.scrollY /
          (document.body.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercent >= trigger) {
  bar.removeClass(animClasses.join(" "));
  bar.addClass("show").addClass(anim);
} else {
  bar.removeClass("show " + animClasses.join(" "));
}
    });
  };

  /* -------------------
   * EVENTS
   * ------------------- */
  $(window).on("scroll", handleScroll);
  $(window).on("load", handleScroll);   // page load pe bhi check
  $(window).on("resize", handleScroll); // resize pe bhi

  /* -------------------
   * BUY NOW
   * ------------------- */
  $("body").on("submit", ".th-sticky-form", function (e) {

    const form = $(this);
    const btn = form.find(".th-btn");
    const action = btn.data("action");

    if (action === "buynow") {
      e.preventDefault();

      $.post(
        wc_add_to_cart_params.ajax_url,
        form.serialize(),
        function () {
          window.location = wc_add_to_cart_params.checkout_url;
        }
      );
    }
  });

});