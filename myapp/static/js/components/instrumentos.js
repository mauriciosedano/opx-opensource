let instrumento = new Vue({
    delimiters: ['[[', ']]'],
    el: '#gestion-instrumentos',
    created(){

        this.listadoInstrumentos();
    },
    data: {
        instrumentos: [],
        almacenamientoInstrumento: {},
        edicionInstrumento: {}
    },
    methods: {
        listadoInstrumentos(){

            axios.get('/instrumentos/list/').then(response => {

              this.instrumentos = response.data;
            });
        },
        almacenarInstrumento(){

            var queryString = Object.keys(this.almacenamientoInstrumento).map(key => {
                return key + '=' + this.almacenamientoInstrumento[key]
            }).join('&');

            axios({
                method: 'post',
                url: '/instrumentos/store/',
                data: queryString,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {

                $("#agregar-instrumento").modal('hide')
                this.almacenamientoInstrumento = {};
                this.listadoInstrumentos();

                Swal.fire({
                  title: 'Exito!',
                  text: 'Instrumento creado satisfactoriamente',
                  type: 'success',
                  confirmButtonText: 'Acepto'
                });
            })
            .catch(response => {

                $("#agregar-instrumento").modal('hide')
                this.almacenamientoInstrumento = {};

                Swal.fire({
                  title: 'Error!',
                  text: 'Ocurrio un error. Por favor intenta de nuevo',
                  type: 'error',
                  confirmButtonText: 'Acepto'
                });
            });
        },
        eliminarInstrumento(id){

            Swal.fire({
              title: 'Estas seguro?',
              text: "No lo puedes revertir",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Acepto!'

            }).then((result) => {

              if (result.value) {

                axios.delete('/instrumentos/delete/' + id)
                .then(response => {

                    this.listadoInstrumentos();

                    Swal.fire(
                      'Eliminado!',
                      'El instrumento fue eliminado de forma exitosa',
                      'success'
                    );
                })
                .catch(response => {

                     this.listadoInstrumentos();

                     Swal.fire(
                      'Error!',
                      'Ocurrio un error por favor intenta de nuevo',
                      'error'
                    );
                });
              }
            });
        },
        editarInstrumento(){

            var queryString = Object.keys(this.edicionInstrumento).map(key => {

                return key + '=' + this.edicionInstrumento[key];

            }).join('&');

            axios({
                method: 'post',
                url: '/instrumentos/' + this.edicionInstrumento.instrid,
                data: queryString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {

                    $("#editar-instrumento").modal('hide');
                    Swal.fire(
                        'Exito!',
                        'Instrumento modificado satisfactoriamente',
                        'success'
                    );
                    this.listadoInstrumentos();
            })
            .catch(() => {

                $("#editar-instrumento").modal('hide');

                Swal.fire(
                    'Error!',
                    'Ocurrio un error. Por favor intenta de nuevo',
                    'error'
                );
            });
        }
    },
    filters: {
        tipoInstrumento(value){

            if(value == 1){

                return "Encuesta";

            } else if(value == 2){

                return "Cartografía";
            }
        }
    }
});