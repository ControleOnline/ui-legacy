diretorios=(
    "quasar-accounting-ui"
    "quasar-carrier-ui"
    "quasar-common-ui"
    "quasar-config-ui"
    "quasar-contracts-ui"
    "quasar-coupon-ui"
    "quasar-crm-ui"
    "quasar-customers-ui"
    "quasar-dashboard-ui"
    "quasar-delivery-ui"
    "quasar-docs-ui"
    "quasar-financial-ui"
    "quasar-freight-ui"
    "quasar-guides-ui"
    "quasar-import-ui"
    "quasar-layout-ui"
    "quasar-login-ui"
    "quasar-orders-ui"
    "quasar-people-ui"
    "quasar-products-ui"
    "quasar-professionals-ui"
    "quasar-providers-ui"
    "quasar-queues-ui"
    "quasar-logistic-ui"
    "quasar-shop-ui"
    "quasar-support-ui"
    "quasar-tasks-ui"
    "quasar-users-ui"
)

caminho_base=$(pwd)

for dir in "${diretorios[@]}"; do
    cd "$caminho_base/$dir" || exit
    npm publish --access=public
    cd "$caminho_base"
done
