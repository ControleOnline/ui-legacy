<script>
/**
 * props example:
 *   "accessToken": "Seu Access-token",
  "clientID": "Seu Client-id",
  "email": "emaildocliente@email.com",
  "installments": 0,
  "items": [
    {
      "name": "Geral",
      "quantity": 1,
      "sku": "10",
      "unitOfMeasure": "unidade",
      "unitPrice": 10
    }
  ],
  "paymentCode": "DEBITO_AVISTA",
  "value": "10"
 */

export default {
  methods: {
    payLio(
      //accessToken,
      clientID,
      email,
      installments,
      items,
      paymentCode,
      value
    ) {
      const data = {
        accessToken: "KeZIHpRaLZwWTR2t60rLZQNdQpGSgUiU3Q6D2awxcNDiVArBT5",
        clientID: clientID,
        email: email,
        installments: installments,
        items: items,
        paymentCode: paymentCode,
        value: value,
      };
      //encode data to base64
      const base64data = btoa(JSON.stringify(data));
      //redirect to lio
      window.location.href = `lio://payment?request=${base64data}&urlCallback=order://response`;
    },
  },
};
</script>
