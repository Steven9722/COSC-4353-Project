$(document).ready(function (){
    validate();
    $('#gallonsInput, #deliveryDateInput').change(validate);

    $('button').on('click', function(){
        var gallons = $('form[id=quoteRequestForm]').find('input[name=gallonsInput]').val();
        var date = $('form[id=quoteRequestForm]').find('input[name=deliveryDateInput]').val();
        var data = {gallons: gallons, date: date};
        $.ajax({
            type: 'POST',
            url: '/quotegetprice',
            data: data,
            success :  function(response){
                $('#suggPrice').val(response.suggPrice);
                $('#totalAmt').val(response.totalAmt);
            }
        });
        $("input[type=submit]").prop("disabled", false);
    });
});

function validate(){
    if ($('#gallonsInput').val().length   >   0   &&
        $('#deliveryDateInput').val().length  >   0) {
        $("button").prop("disabled", false);
    }
    else {
        $("button").prop("disabled", true);
    }
};
