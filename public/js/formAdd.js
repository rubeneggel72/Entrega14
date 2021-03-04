
$(function () {
    $(document).on('submit', "#formAdd", function (e) {
        e.preventDefault();

        $.ajax({
            url: $(this).attr('action'),
            type: "post",
            data: $(this).serialize(),
            error: function () {
                alert("ERROR : CANNOT CONNECT TO SERVER");
            },
            success: function (data) {
                alert("Se agregó el producto: " + data.title + " ID: " + data.id);
                document.getElementById('title').value = ""
                document.getElementById('price').value = ""
                document.getElementById('thumbnail').value = ""
            }
        });
        return false;
    });
});
