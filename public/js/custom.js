"use strict";

// ! test script
// $(document).ready(function () {
//       $("p").click(function () {
//             alert("The paragraph was clicked.");
//       });
// });



//* ================= Deleting Article : through AJAX   ======================

$(document).ready(function () {
      $('.delete-article').on('click', function (e) {
            let $target = $(e.target);
            // console.log($target);

            const id = $target.attr('data-id');
            // console.log(id);
            // console.log('/article/' + id);

            let message = `Deleting Article : Are u Sure ??`;
            let s = confirm(message);
            if (s === true) {
                  $.ajax({
                        type: 'DELETE',
                        url: '/article/' + id,
                        success: function (response) {
                              window.location.href = '/';
                        },
                        error: function (err) {
                              let message = `Article NOT Deleted \n${JSON.stringify(err)}`;
                              alert(message);
                              console.log(message);
                        }
                  });

            }
      });
});
// * ======================= END - Deleting Article =============================