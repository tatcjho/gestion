var firestore;
$(document).ready(function () {
    console.log('*** Cargando ***');
    var config = {
        apiKey: "AIzaSyC3xzNqcJHSfOd2mz1UAsYF0X9EgiG-tpk",
        authDomain: "vazseguros-c7bbe.firebaseapp.com",
        projectId: "vazseguros-c7bbe",
        storageBucket: "vazseguros-c7bbe.appspot.com",
        messagingSenderId: "210809593084",
        appId: "1:210809593084:web:f6cd7942bd32b14b57cb79",
        measurementId: "G-M6722LNSBJ"
    };

    firebase.initializeApp(config);
    // const firestore = firebase.firestore();

    firestore = firebase.firestore();
});


export function InitPago(total, id, order_transaccion_id) {
    console.log(id.toString());
    console.log(total);
    console.log(total.toFixed(0));
    var totalAmount = total.toFixed(0);
    console.log(parseInt(totalAmount));
    payphone.Button({
        token: 'jBnxJdPYC-2OfZpcTXoLbZ27HeZFHCUJSq2hDwi6QMiHzASu36z-Ml6zZcTIZFeHRuTsUMsk4JA4EFCIwkQ0NJKZ5z3K3A8szEcXNWma1Tn2wBojReCOgSY1oQmzadUqfCVJrPl0UF6DS4VV4sdqutbLrCtYrY_Nrr4y5HZ0QQAMExWECWjg-U7OxrIkkpLJMmkMywUykbErw-nsEXoob_M_Vq15n77dNYVp6QEfaDOZsrKakZvTpTjjclBJEvPYZ8ACyUPaclsUoUT6r0uokFBtH2UxafcBjnc3j7-FqXybmZ7HzD3iRA30Iy3ZoBkC6eVahw',
        btnHorizontal: true,
        btnCard: true,
        createOrder: function (actions) {
            return actions.prepare({
                amount: parseInt(totalAmount),
                amountWithoutTax: parseInt(totalAmount),
                currency: "USD",
                clientTransactionId: id
            });
        },
        onComplete: function (model, actions) {
            //Se confirma el pago realizado
            actions.confirm({
                id: model.id,
                clientTxId: model.clientTxId
            }).then(function (value) {
                console.log('*** Respuesta de payphoone despues de pagar ***');
                console.log(value);
                // ***AQUI***
                var ref = firestore.collection("orders").doc(order_transaccion_id).collection('payment').doc(id.toString());
                ref.set(
                    value
                ).then(function () {
                    if (value.transactionStatus == "Approved") {
                        alert('Su orden ha sido generado correctamente!');
                        window.location.assign("https://4woman.ec/"),
                            localStorage.removeItem("arrayProductCartCache");
                        localStorage.removeItem("order");
                    } else {
                        alert('Se ha presentado un error: ' + value.transactionStatus + ': ' + value.message);
                    }
                }).catch(function (e) {
                    console.log(e);
                });
            }).catch(function (err) {
                console.log('*** Respuesta ERROR de payphoone despues de pagar ***');
                console.log(err);
            });
        }
    }).render('#pp-button');

    return '*** Respuesta de payphoone ***'
}