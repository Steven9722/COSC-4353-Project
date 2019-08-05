$(document).ready(function (){
    $('button').on('click', function(){
        var nameInput = $('form[id=profileForm]').find('input[name=nameInput]').val();
        var address1Input = $('form[id=profileForm]').find('input[name=address1Input]').val();
        var address2Input = $('form[id=profileForm]').find('input[name=address2Input]').val();
        var cityInput = $('form[id=profileForm]').find('input[name=cityInput]').val();
        var stateInput = $('form[id=profileForm]').find('select[name=stateInput]').val();
        var zipcodeInput = $('form[id=profileForm]').find('input[name=zipcodeInput]').val();
        var data = {nameInput: nameInput, address1Input: address1Input, address2Input: address2Input, 
        cityInput: cityInput, stateInput: stateInput, zipcodeInput: zipcodeInput};
        $.ajax({
            type: 'POST',
            url: '/profile',
            data: data,
            success :  function(){
                alert('Profile Saved!');
            }
        });
    });
});

