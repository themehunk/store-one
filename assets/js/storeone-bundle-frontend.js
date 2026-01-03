jQuery(function ($) {

    if (!$('.s1-bundle-item').length) return;

    function clamp(val, min, max) {
        if (val < min) return min;
        if (max > 0 && val > max) return max;
        return val;
    }

    function calculateBundle() {

    let total = 0;
    let items = [];

    const scope = $('.storeone-bundle-frontend').data('discount-scope');

    $('.s1-bundle-item').each(function () {

        const $item = $(this);

        let basePrice = parseFloat($item.data('price')) || 0;
        let qty       = parseInt($item.find('.s1-qty-input').val(), 10) || 1;

        let type    = $item.data('discount-type');
        let percent = parseFloat($item.data('discount-percent')) || 0;
        let fixed   = parseFloat($item.data('discount-fixed')) || 0;

        let linePrice = basePrice * qty;

        // ✅ APPLY PER PRODUCT DISCOUNT ONLY IF scope=store_product
        if (scope === 'store_product') {

            if (type === 'percent') {
                linePrice -= linePrice * percent / 100;
            }

            if (type === 'fixed') {
                linePrice -= fixed;
            }
        }

        linePrice = Math.max(0, linePrice);
        total += linePrice;

        items.push({
            id: $item.data('id'),
            qty: qty,
            price: linePrice
        });
    });

    // ✅ APPLY BUNDLE DISCOUNT AT END
    if (scope === 'store_bundle') {

        const bundleType    = $('#_storeone_discount_type').val(); // OR data attr
        const bundlePercent = parseFloat($('#_storeone_discount_percent').val()) || 0;
        const bundleFixed   = parseFloat($('#_storeone_discount_fixed').val()) || 0;

        if (bundleType === 'percent') {
            total -= total * bundlePercent / 100;
        }

        if (bundleType === 'fixed') {
            total -= bundleFixed;
        }
    }

    total = Math.max(0, total);

    $('#storeone_bundle_data').val(JSON.stringify(items));
}


    /* ---------------------------
     * PLUS / MINUS BUTTONS
     * --------------------------- */
    $(document).on('click', '.s1-qty-btn', function () {

        const $input = $(this).siblings('.s1-qty-input');
        if (!$input.length) return;

        let val = parseInt($input.val(), 10) || 1;
        let min = parseInt($input.attr('min'), 10) || 1;
        let max = parseInt($input.attr('max'), 10) || 0;

        if ($(this).hasClass('plus')) val++;
        if ($(this).hasClass('minus')) val--;

        val = clamp(val, min, max);

        $input.val(val).trigger('change');
    });

    /* ---------------------------
     * EVENTS
     * --------------------------- */
    $(document).on(
        'change keyup',
        '.s1-bundle-check, .s1-qty-input',
        calculateBundle
    );

    /* ---------------------------
     * INIT
     * --------------------------- */
    calculateBundle();
});
