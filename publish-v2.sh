diretorios=(
    "ui-legacy/quasar-accounting-ui"
    "ui-legacy/quasar-carrier-ui"
    "ui-legacy/ui-common"
    "ui-legacy/quasar-config-ui"
    "ui-legacy/quasar-contracts-ui"
    "ui-legacy/quasar-coupon-ui"
    "quasar-crm-ui"
    "ui-legacy/quasar-customers-ui"
    "ui-legacy/ui-dashboard"
    "ui-legacy/quasar-delivery-ui"
    "ui-legacy/ui-docs"
    "ui-financial"
    "quasar-freight-ui"
    "ui-legacy/ui-guides"
    "ui-legacy/ui-import"
    "ui-layout"
    "ui-legacy/ui-login"
    "ui-legacy/ui-orders"
    "ui-legacy/quasar-people-ui"
    "quasar-products-ui"
    "ui-legacy/quasar-professionals-ui"
    "ui-legacy/quasar-providers-ui"
    "quasar-queues-ui"
    "quasar-logistic-ui"
    "quasar-shop-ui"
    "ui-legacy/quasar-support-ui"
    "quasar-tasks-ui"
    "ui-legacy/quasar-users-ui"
)

caminho_base=$(pwd)

for dir in "${diretorios[@]}"; do
    cd "$caminho_base/$dir" || exit
    npm publish --access=public
    cd "$caminho_base"
done
