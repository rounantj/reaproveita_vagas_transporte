var wordKey = "unimarlinhares"
var starter =  moment().add(-35, "days").format("YYYY-MM-DD")
var now =  moment().format("YYYY-MM-DD");
var CONTENT_TRAVEL = [], FULL_DATA = []
$("#search").prop('readonly', true);
console.log("https://@"+wordKey+".auttran.com/api/unimar_passageiros.php?from=" + starter + "&to=" + now + "&cliente=8&token="+ moment().format("YYYYMMDD") +"unimar@" + moment().format("HH"))
$.ajax({
    type: "GET",
    dataType: 'json',
    url: "https://@"+wordKey+".auttran.com/api/unimar_passageiros.php?from=" + starter + "&to=" + now + "&cliente=8&token="+ moment().format("YYYYMMDD") +"unimar@" + moment().format("HH"),
    data: "",
    success: async function(data3) {
      console.log(data3)
      $("#search").prop('readonly', false);
      

      $("#search").click(function(){
        var cad = Number($("#cadastro").val())

        
            for(const k in data3){
                if(data3[k].passageiros.length > 0){
                    var pass = data3[k].passageiros
                    for(const p in pass){
                        if(Number(pass[p].matricula) == cad){
                                CONTENT_TRAVEL.push(
                                    {
                                        "itinerario":data3[k].itinerario, 
                                        "rota":data3[k].linha, 
                                        "carro": Number(data3[k].frota), 
                                        "viagem":Number(data3[k].viagem),
                                        "info":pass[p]
                                    }
                                )
                        }
                    }
                }
            }
           

            if(CONTENT_TRAVEL.length >0){
                $(".main-form").css("background","White");
                $(".main-form").append('<img src="images/loading.gif" alt="#" /><br<br><hr>');
                setTimeout(() => {
                    $(".main-form").find("img").remove();
                    $(".banner-main").css("height","1500px");
                    console.log(CONTENT_TRAVEL)
                    var lat =null, lon =null;
    
                    for(const u in CONTENT_TRAVEL){
                        if(CONTENT_TRAVEL[u].itinerario.indexOf("IDA") >-1){
                            lat = Number(CONTENT_TRAVEL[u].info.lat)
                            lon = Number(CONTENT_TRAVEL[u].info.lon)
                            break;
                        }
                    }
    
                    if(lat != null){
                        $.ajax({
                            type: 'GET',
                            url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon,
                            data: "",
                            success: function (data) {
                                console.log(data)
                                var busca = data.address.city_district
                                var CURSO_ATUAL = []
                                for(const k in ROTEIROS){
                                    if(CONTENT_TRAVEL[0].rota.split(" ")[1].trim() == ROTEIROS[k].rota.split(" ")[1].trim()){        
                                       CURSO_ATUAL = ROTEIROS[k].curso.replace(/\t/g,"").split(";");
                                        FULL_DATA.push({"rotaOpicional":ROTEIROS[k]}) 
                                        break;
                                    }
                                }
        
                             
                                    for(const j in ROTEIROS){
                                        if(ROTEIROS[j].curso.indexOf(busca) > -1){
                                            FULL_DATA.push({"rotaOpicional":ROTEIROS[j]})
                                        }
                                    }
                              
                                $(".main-form").append('<br><br><h3>'+CONTENT_TRAVEL[0].info.nome+"</h3>");
                
                                var icone = '<i style="color: green" class="fas fa-long-arrow-alt-right"></i>'
                                var dados = getInfo(CONTENT_TRAVEL[0].rota)
                                var horarioSaida = dados.passageiros[0].hora
                                var dataSaida = dados.passageiros[0].data
                                var totalPassageiros = dados.passageiros.length
                                var lotacao = lot(Number(dados.frota))
                                var vagas = lotacao - totalPassageiros

                                $(".main-form").append('<h4>Roteiro Oficial: <span style="color: rgb(0,87,156)">'+CONTENT_TRAVEL[0].itinerario+'</span><br><span style="color: rgb(0,87,156); font-size: 0.8rem">Data: '+dataSaida+', Horário Saída: '+getVolta(horarioSaida)+'<br>Lotação: '+totalPassageiros+'/'+lotacao+', Vagas: '+vagas+'</span></h4><p>'+FULL_DATA[0].rotaOpicional.curso.replace(/;/g, " "+icone)+icone+" WEG Linhares</p><hr>");
                
                                for(let a = 1; a < FULL_DATA.length; a++){
                                   

                                    var icone = '<i style="color: green" class="fas fa-long-arrow-alt-right"></i>'
                                    var dados = getInfo(FULL_DATA[a].rotaOpicional.rota.trim())
                                    var horarioSaida = dados.passageiros[0].hora
                                    var dataSaida = dados.passageiros[0].data
                                    var totalPassageiros = dados.passageiros.length
                                    var lotacao = lot(Number(dados.frota))
                                    var vagas = lotacao - totalPassageiros

                                    $(".main-form").append('<h4>Roteiro Alternativo: <span style="color: rgb(0,87,156)">'+FULL_DATA[a].rotaOpicional.rota+
                                    '</span><br><span style="color: rgb(0,87,156); font-size: 0.8rem">Data: '+dataSaida+', Horário Saída: '+getVolta(horarioSaida)+'<br>Lotação: '+totalPassageiros+'/'+lotacao+', Vagas: '+vagas+'</span></h4><p>'+FULL_DATA[a].rotaOpicional.curso.replace(/;/g, " "+icone)+icone+" WEG Linhares</p><hr>");
    
                                    //$(".main-form").append('<h4>Roteiro Oficial: <span style="color: rgb(0,87,156)">'+CONTENT_TRAVEL[0].itinerario+'</span></h4><p>'+FULL_DATA[0].rotaOpicional.curso.replace(/;/g, " "+icone)+icone+" WEG Linhares</p><hr>");
                    
                                }
                
                                console.log(FULL_DATA)

                                function getInfo(ROTA){
                                    console.log(ROTA)
                                    ROTA = ROTA.replace("  "," ").trim()
                                    console.log(ROTA)
                                    var dados = []
                                    for(const k in data3){
                                        if(data3[k].passageiros.length > 1 && data3[k].passageiros.length != null && data3[k].passageiros.length != undefined){
                                            if(data3[k].linha != null){
                                                if(data3[k].linha.trim() == ROTA.trim() && data3[k].itinerario.trim().indexOf("IDA") > -1 && data3[k].passageiros[0].data == moment().format("DD/MM/YYYY")){
                                                    console.log(data3[k])
                                                    return data3[k]
                                                }
                                            }
                                           
                                        }
                                        
                                    }
                                }
        
                            },
                            error: function (data) {
                                // em caso de erro...
                            },
                            complete: function(){
                                // ao final da requisição...
                            }
                        });             
        
                        
        
    
                    }else{
                        alert("Colaborador não utilizou o transporte fretado nos últimos 35 dias!")
    
                    }
    
                   
                   
    
    
    
    
                }, 3000);

            }else{
                alert("Colaborador não utilizou o transporte fretado nos últimos 35 dias!")
            }

           

            
           
      })

     


      
   
    



    },
    error: function(data3) {
        console.log(data3)
    },
    complete: function() {
     
    },
});


/*=====================================FUNCTIONS==============================================*/

function OrdenaJson(lista, chave, ordem) {
    return lista.sort(function(a, b) {
        var x = a[chave];
        var y = b[chave];
        if (ordem === 'ASC') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (ordem === 'DESC') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}
var ROTEIROS = [
    {"rota":"	ROTA 01A","curso":"	Palmital; BR-101; BR-101-Três Barras; Juparanã; Colina; Centro; Centro-BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 01B","curso":"	Palmital; BR-101; BR-101-Nossa Sra. Da Conceição; Colina; Centro; Centro-BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 02A","curso":"	Palmital; BR-101; BR-101-Linhares V; Linhares-Movelar; Movelar- Gaivotas; Gaivotas- São José; São José-BR-101; BR-101-Palmital; Palmital-Jardim Laguna; Lagoa do Meio; Lagoa do Meio-Juparanã; Juparanã-BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 02B","curso":"	Palmital; Palmital-Lagoa do Meio-José Rodrigues Maciel; Novo Horizonte; Novo Horizonte-Juparanã; Juparanã-BR-101;  BR-101-Rio Quatel	"},
    {"rota":"	ROTA 03","curso":"	Palmital; BR-101; BR-101-Baixo Quartel; Baixo Quartel-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 04","curso":"	Jacupemba-Assentamento; Assentamento-Jacupemba; Jacupemba-BR-101; BR-101-Quartel de Cima; Quartel de Cima-Rio Quartel; Rio Quartel- BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 05A","curso":"	Jacupemba; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 05B","curso":"	Jacupemba; BR-101-Colina; Colina-BR-101;BR-101-Rio Quartel	"},
    {"rota":"	ROTA 05C","curso":"	Jacupemba-São José; São José-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 05D","curso":"	Jacupemba-Nova Colatina; Novo Colatina-Jacupemba; Jacupemba-São José-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 06A","curso":"	Palmital; BR-101; BR-101-Bebedouro; Bebedouro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 06B","curso":"	Palmital; BR-101; BR-101-Bebedouro; Bebedouro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 06C","curso":"	Palmital; BR-101; BR-101-Areal; Areal-Bebedouro; Bebedouro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 10A","curso":"	Palmital; BR-101; BR-101-Centro; Centro-Araçá; Araçá-Aviso; Aviso-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 10B","curso":"	Palmital; BR-101; BR-101-Centro; Centro-Aviso; Aviso-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 10C","curso":"	Palmital; BR-101; BR-101-Centro; Centro-Aviso; Aviso-BR-101; BR-101-Residencial Rio Doce; Residencial Rio Doce-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 10D","curso":"	Palmital; BR-101; BR-101-Shell; Shell-Araçá; Araçá-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 11A","curso":"	Palmital; BR-101; BR-101-Movelar; Movelar-Planalto; Planalto-Nova Espença; Linhares V; São José; São José-BR-101	"},
    {"rota":"	ROTA 11C","curso":"	Palmital; BR-101; BR-101-Movelar; Movelar-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 11D","curso":"	Palmital; BR-101; BR-101-Planalto; Movelar-Planalto; Planalto-Movelar; Movelar-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 12A","curso":"	Palmital; BR-101; Lagoa do Meio; José Rodrigues Maciel; Bairo Novo Horizonte; Bairo Novo Horizonte-Interlagos; Interlagos-Araçá; Araçá-Centro; Centro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 12B","curso":"	Palmital; BR-101; Lagoa do Meio; José Rodrigues Maciel; Bairo Novo Horizonte; Bairo Novo Horizonte-Interlagos; Interlagos-Araçá; Araçá-Centro; Centro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 12C","curso":"	Palmital; BR-101; Lagoa do Meio; José Rodrigues Maciel; Bairo Novo Horizonte; Bairo Novo Horizonte-Interlagos; Interlagos-Araçá; Araçá-Centro; Centro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 12D","curso":"	Palmital; BR-101; Lagoa do Meio; José Rodrigues Maciel; Bairo Novo Horizonte; Bairo Novo Horizonte-Interlagos; Interlagos-Araçá; Araçá-Centro; Centro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 12E","curso":"	Palmital; BR-101; BR-101-Juparanã; Juparanã-Bairo Novo Horizonte; Bairo Novo Horizonte-Interlagos; Interlagos-Araçá; Araçá-Centro; Centro-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 13","curso":"	Garaná-BR-101; BR-101-Rio Quartel 	"},
    {"rota":"	ROTA 14A","curso":"	Palmital; BR-101; BR-101-Canivete; Canivete- Vila Maria; Vila Maria-Canivete; Canivete-Nova Betania; Nova Betania-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 14B","curso":"	Palmital; BR-101; BR-101-Santa Cruz; Santa Cruz- Canivete; Canivete-BR-101; BR-101-Rio Quartel	"},
    {"rota":"	ROTA 18","curso":"	Palmital; BR-101; BR-101-Linhares V; Linhares-São José; São José-BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 18B","curso":"	Palmital; BR-101; BR-101-Linhares V; Linhares-São José; São José-BR-101; BR-101-Palmital; Palmital-Jardim Laguna; Jardim Laguna-José Rodrigues Macial; Novo Horizonte-Juparanã; Juparanã-BR-101; BR-101-Rio Quatel	"},
    {"rota":"	ROTA 07","curso":"	Palmital; BR-101; BR-101 - Três Barras; Juparanã; Conceição; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 08","curso":"	Palmital; Jardim Laguna; BNH; Interlagos; Araçá; Aviso;Centro; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 09","curso":"	Jacupemba; Mambrine; BR-101;  Bela Vista; Mambrine; BR-101; Baixo Quartel; Rio Quartel	"},
	{"rota":"	ROTA 15","curso":"	Palmital; BR-101; Canivete; Vila Isabel; Nova Betânia; Santa Cruz; Jocafe; Planalto; Movelar; BR-101; Rio Quartel. 	"},
	{"rota":"	ROTA 16","curso":"	Palmital; Jardim Laguna; José Rodrigues; BNH; Interlagos; Araçá; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 17","curso":"	Palmital; Jardim Laguna; Lagoa do Meio; José Rodrigues; BNH; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 19","curso":"	Palmital; BR-101; Linhares V; Lagoa Park; São José; Palmital; BR-101; Colina; Rio Quartel 	"},
	{"rota":"	ROTA 20","curso":"	Palmital; BR-101;Conceição; BR-101; Centro; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 21","curso":"	Palmital; BR-101; Shell; BR-101; Bebedouro; BR-101; Rio Quartel	"},
	{"rota":"	ROTA 22","curso":"	Palmital; BR-101; Planalto; Movelar; Linhares V; São José; Palmital; BR-101; Rio Quartel 	"},
	{"rota":"	ROTA 23","curso":"	Palmital; Jardim Laguna; José Rodrigues; BNH; Interlagos; Araçá; BR-101; Rio Quartel	"},

    
]

function lot(carro) {
    var capacidade = [{
            "carro": 7578,
            "lotacao": 25
        },
        {
            "carro": 7582,
            "lotacao": 25
        },
        {
            "carro": 7584,
            "lotacao": 25
        },
        {
            "carro": 7606,
            "lotacao": 25
        },
        {
            "carro": 7608,
            "lotacao": 25
        },
        {
            "carro": 7610,
            "lotacao": 25
        },
        {
            "carro": 7612,
            "lotacao": 25
        },
        {
            "carro": 7614,
            "lotacao": 25
        },
        {
            "carro": 7616,
            "lotacao": 25
        },
        {
            "carro": 7618,
            "lotacao": 25
        },
        {
            "carro": 7622,
            "lotacao": 25
        },
        {
            "carro": 7624,
            "lotacao": 25
        },
        {
            "carro": 7628,
            "lotacao": 25
        },
        {
            "carro": 7630,
            "lotacao": 25
        },
        {
            "carro": 7632,
            "lotacao": 25
        },
        {
            "carro": 7634,
            "lotacao": 25
        },
        {
            "carro": 8002,
            "lotacao": 23
        },
        {
            "carro": 8004,
            "lotacao": 23
        },
        {
            "carro": 8006,
            "lotacao": 23
        },
        {
            "carro": 8008,
            "lotacao": 23
        },
        {
            "carro": 8010,
            "lotacao": 23
        },
        {
            "carro": 8012,
            "lotacao": 23
        },
        {
            "carro": 8016,
            "lotacao": 23
        },
        {
            "carro": 8018,
            "lotacao": 23
        },
        {
            "carro": 8020,
            "lotacao": 23
        },
        {
            "carro": 8014,
            "lotacao": 23
        },
        {
            "carro": 8022,
            "lotacao": 23
        },
        {
            "carro": 8024,
            "lotacao": 23
        },
        {
            "carro": 8026,
            "lotacao": 23
        },
        {
            "carro": 8028,
            "lotacao": 23
        },
        {
            "carro": 9004,
            "lotacao": 17
        },
        {
            "carro": 9008,
            "lotacao": 23
        },
        {
            "carro": 9010,
            "lotacao": 23
        },
        {
            "carro": 9014,
            "lotacao": 18
        },
        {
            "carro": 9045,
            "lotacao": 17
        },
        {
            "carro": 9046,
            "lotacao": 19
        },
        {
            "carro": 9062,
            "lotacao": 17
        },
        {
            "carro": 11006,
            "lotacao": 15
        },
        {
            "carro": 11008,
            "lotacao": 20
        },
        {
            "carro": 11010,
            "lotacao": 20
        },
        {
            "carro": 11012,
            "lotacao": 20
        },
        {
            "carro": 11014,
            "lotacao": 19
        },
        {
            "carro": 11016,
            "lotacao": 19
        },
        {
            "carro": 11018,
            "lotacao": 19
        },
        {
            "carro": 12016,
            "lotacao": 19
        },
        {
            "carro": 12022,
            "lotacao": 20
        },
        {
            "carro": 12028,
            "lotacao": 19
        },
        {
            "carro": 10002,
            "lotacao": 25
        },
        {
            "carro": 10004,
            "lotacao": 25
        }


    ]
    var lotacao = 25
    for (const key in capacidade) {

        if (carro == capacidade[key].carro) {
            lotacao = capacidade[key].lotacao
        }
    }
    return lotacao
}

function getVolta(horario){
    if(horario > '05:00:00' && horario < "07:30:00"){return "17:28"}
    if(horario > '03:10:00' && horario < "05:00:00"){return "14:28"}
    if(horario > '13:00:00' && horario < "14:18:00"){return "23:34"}
    if(horario > '22:00:00' && horario < "23:24:00"){return "05:10"}
}