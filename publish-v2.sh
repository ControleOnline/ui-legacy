diretorios=(
    "quasar-legacy-ui/quasar-accounting-ui"
    "quasar-legacy-ui/quasar-carrier-ui"
    "quasar-legacy-ui/quasar-common-ui"
    "quasar-legacy-ui/quasar-config-ui"
    "quasar-legacy-ui/quasar-contracts-ui"
    "quasar-legacy-ui/quasar-coupon-ui"
    "quasar-legacy-ui/quasar-crm-ui"
    "quasar-legacy-ui/quasar-customers-ui"
    "quasar-legacy-ui/quasar-dashboard-ui"
    "quasar-legacy-ui/quasar-delivery-ui"
    "quasar-legacy-ui/quasar-docs-ui"
    "quasar-financial-ui"
    "quasar-freight-ui"
    "quasar-legacy-ui/quasar-guides-ui"
    "quasar-legacy-ui/quasar-import-ui"
    "quasar-layout-ui"
    "quasar-legacy-ui/quasar-login-ui"
    "quasar-legacy-ui/quasar-orders-ui"
    "quasar-legacy-ui/quasar-people-ui"
    "quasar-products-ui"
    "quasar-legacy-ui/quasar-professionals-ui"
    "quasar-legacy-ui/quasar-providers-ui"
    "quasar-queues-ui"
    "quasar-logistic-ui"
    "quasar-shop-ui"
    "quasar-legacy-ui/quasar-support-ui"
    "quasar-legacy-ui/quasar-tasks-ui"
    "quasar-legacy-ui/quasar-users-ui"
)

caminho_base=$(pwd)

for dir in "${diretorios[@]}"; do
    cd "$caminho_base/$dir" || exit
    npm publish --access=public
    cd "$caminho_base"
done
