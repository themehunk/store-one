jQuery(function ($) {

    /* =====================================================
     * BASE ELEMENTS
     * ===================================================== */
    const $bundle = $('.storeone-bundle-frontend');
    if (!$bundle.length) return;

    const isStoreBundle =
    $bundle.data('discount-scope') === 'store_bundle';

    const $addToCartBtn = $('.single_add_to_cart_button');
    const $hiddenInput  = $('#storeone_bundle_data');

    /* =====================================================
     * PRICE FORMATTER (FROM PHP TEMPLATE)
     * ===================================================== */
    function formatPrice(amount) {
        amount = parseFloat(amount) || 0;

        const $tpl = $('.s1-currency-template');
        if (!$tpl.length) {
            return amount.toFixed(2);
        }

        const html = $tpl.html(); // e.g. ₹0.00
        return html.replace(/0+([.,]0+)?/, amount.toFixed(2));
    }

    /* =====================================================
     * HELPERS
     * ===================================================== */
    function getQty($item) {
        return parseInt($item.attr('data-qty'), 10) || 1;
    }

    function clampQty($item, qty) {
        const allow = parseInt($item.data('allow-qty'), 10) || 0;
        const min   = parseInt($item.data('min'), 10) || 0;
        const max   = parseInt($item.data('max'), 10) || 0;

        // Quantity change not allowed → fixed
        if (!allow) {
            return getQty($item);
        }

        if (min > 0 && qty < min) qty = min;
        if (max > 0 && qty > max) qty = max;

        return qty;
    }

    /* =====================================================
     * APPLY STRIKE (ONLY TOTAL)
     * ===================================================== */
    function applyStrikeToTotal() {
        if (!isStoreBundle) return;

        $bundle.find('.s1-line-total').each(function () {
            const $el = $(this);

            if ($el.find('del').length) return;

            const html = $el.html();
            if (!html) return;

            $el.html('<del>' + html + '</del>');
        });
    }

    /* =====================================================
     * UPDATE LINE PRICE (UNIT × QTY)
     * ===================================================== */
    function updateLinePrice($item) {
        const unit = parseFloat($item.data('price')) || 0;
        const qty  = getQty($item);

        $item.find('.s1-line-qty').text(qty);

        const totalHtml = formatPrice(unit * qty);
        $item.find('.s1-line-total').html(totalHtml);
    }

    /* =====================================================
     * BUILD BUNDLE JSON
     * ===================================================== */
    function buildBundleData() {

        let items = [];

        $('.s1-bundle-item').each(function () {

            const $item = $(this);
            const isOptional =
                $item.find('.s1-bundle-check').length
                    ? $item.find('.s1-bundle-check').is(':checked')
                    : true;

            if (!isOptional) return;

            items.push({
                id:  $item.data('id'),
                qty: getQty($item)
            });
        });

        if (!items.length) {
            $hiddenInput.val('');
            $addToCartBtn.prop('disabled', true);
            return;
        }

        $hiddenInput.val(JSON.stringify({ items }));
        $addToCartBtn.prop('disabled', false);
    }

    /* =====================================================
     * QTY BUTTONS (+ / -)
     * ===================================================== */
    $(document).on('click', '.s1-qty-btn', function () {

        const $item = $(this).closest('.s1-bundle-item');
        let qty = getQty($item);

        if ($(this).hasClass('plus'))  qty++;
        if ($(this).hasClass('minus')) qty--;

        qty = clampQty($item, qty);

        $item.attr('data-qty', qty);
        $item.find('.s1-line-qty').text(qty);

        updateLinePrice($item);
        buildBundleData();
        applyStrikeToTotal();
    });

    /* =====================================================
     * OPTIONAL ITEM TOGGLE
     * ===================================================== */
    $(document).on('change', '.s1-bundle-check', function () {
        buildBundleData();
        applyStrikeToTotal();
    });

    /* =====================================================
     * VARIABLE PRODUCT SUPPORT
     * ===================================================== */
    $(document).on('found_variation', '.variations_form', function (e, variation) {

        const price = parseFloat(variation.display_price) || 0;
        const $item = $('.s1-bundle-item[data-id="' + variation.product_id + '"]');

        if (!$item.length) return;

        $item.attr('data-price', price);

        // Unit price untouched (no del)
        $item.find('.s1-line-unit').html(formatPrice(price));

        updateLinePrice($item);
        buildBundleData();
        applyStrikeToTotal();
    });

    /* =====================================================
     * INIT (IMPORTANT)
     * ===================================================== */
    $('.s1-bundle-item').each(function () {
        const $item = $(this);

        let qty = getQty($item);
        qty = clampQty($item, qty);

        $item.attr('data-qty', qty);
        $item.find('.s1-line-qty').text(qty);

        updateLinePrice($item);
    });

    buildBundleData();
    applyStrikeToTotal();
});