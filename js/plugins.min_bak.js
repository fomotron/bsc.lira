function checkWidth(e) {
    $(window).width() <= 991 && ($(".dropdown-submenu a").on("click", function(e) {
            $(this).next("ul").toggle(),
                e.stopPropagation()
        }),
        $(".navbar-nav > .nav-item > .nav-link").on("click", function(e) {
            $(".navbar").removeClass("active"),
                $(".navbar-toggler-icon").removeClass("active"),
                $("body").removeClass("offcanvas--open")
        }))
}

function navMenu() {
    $('[data-toggle="navbarToggler"]').click(function() {
            $(".navbar").toggleClass("active"),
                $("body").toggleClass("offcanvas--open")
        }),
        $(".navbar-toggler").click(function(e) {
            $(".navbar-toggler-icon").toggleClass("active"),
                e.stopPropagation()
        });
    var t = $(".navbar-sticky");
    $("body").on("click", function() {
            $(".navbar").removeClass("active"),
                $(".navbar-toggler-icon").removeClass("active"),
                $("body").removeClass("offcanvas--open")
        }),
        $("body").on("click", ".navbar-inner", function() {
            e.stopPropagation(),
                e.preventDefault()
        }),
        $(window).on("scroll load", function() {
            var e = $(window).scrollTop();
            120 <= e ? t.addClass("navbar-sticky--moved-up") : t.removeClass("navbar-sticky--moved-up"),
                250 <= e ? t.addClass("navbar-sticky--transitioned") : t.removeClass("navbar-sticky--transitioned"),
                500 <= e ? t.addClass("navbar-sticky--on") : t.removeClass("navbar-sticky--on")
        })
}
var game_timer;

function countDown() {
    if (game_timer) {
        clearInterval(game_timer);
    }
    var e = $("#date").data("date"),
        i = new Date(e).getTime();
    game_timer = setInterval(function() {
        var e = (new Date).getTime(),
            t = i - e;
        if (i <= 0) {
            t = 0;
        }
        document.getElementById("hours") && ( /*document.getElementById("days").innerText = addZero(Math.floor(t / 864e5)),*/
            document.getElementById("hours").innerText = addZero(Math.floor(t % 864e5 / 36e5), 2),
            document.getElementById("minutes").innerText = addZero(Math.floor(t % 36e5 / 6e4), 2),
            document.getElementById("seconds").innerText = addZero(Math.floor(t % 6e4 / 1e3), 2))
    }, 1e3)
}

function InitMyWallet() {
    if (state.wallet_type == "imtoken") {
        //alert("imtoken")
        imToken.callAPI('user.showAccountSwitch', { chainType: "TRON" }, function(err, address) {
            if (err) {
                alert(err)
            } else {
                state.address = address;
                initWallet();
            }
        })
    } else if (state.wallet_type == "web3") {
        initWallet();
    } else {
        window.tronWeb.setDefaultBlock('latest');
        let tronWeb = window.tronWeb;
        if (state.address == "???????????????") {
            window.tronWeb.defaultAddress.base58 = "";
            window.tronWeb.defaultAddress.hex = "";
            tronWeb.defaultAddress.base58 = "";
            tronWeb.defaultAddress.hex = "";
        }
        state.address = tronWeb.defaultAddress.base58;

    }
}

function initWallet() {
    var contract_url = "#";
    var my_address_link = "#";
    var contract_address = "";
    if (state.wallet_type == "web3") {
        contract_address = base_contract_address;
        web3_obj.eth.getAccounts().then(address => {
            if (address.length <= 0) {
                my_address_link = "#";
                state.address = "???????????????";
            } else {
                state.address = address[0];
                my_address_link = state.tron_domain + "/address/" + address[0];

                if (web3_obj.utils.isAddress(state.address)) {
                    show_msg = '<a href="' + my_address_link + '" target="_blank">' + state.address.substring(0, 7) + "..." + state.address.substring(state.address.length - 4) + '</a>';
                }
                //??????????????????
                $(".header_right p").html(show_msg);
                web3_obj.eth.getBalance(address[0]).then((Balance) => {
                    var Balance_format = math.chain(Balance).divide(math.pow(10, 18)).done();
                    $(".header_right strong").html(Balance_format + " BNB ");
                    console.log("????????????:" + Balance_format);
                });

                contract = new web3_obj.eth.Contract(artifact.abi, contract_address);

                contract.methods.getOwner().call().then(output => {
                    console.log("getOwner", output);
                    let owner = output;
                    state.owner = owner;

                });
                InitPage();
            }
        });
        state.contract_address = contract_address;
        contract_url = state.tron_domain + "/address/" + contract_address;
    } else {
        my_address_link = state.tron_domain + "/#/address/" + state.address;
        if (!tronWeb.isAddress(state.address)) {
            my_address_link = "#";
            state.address = "???????????????";
            window.tronWeb.defaultAddress.hex = "41bb41c18a6540fde254878c60b6fc4b78b365d228";
            window.tronWeb.defaultAddress.base58 = "TT3L8jqyuRrM1YqiVvMFZFmNnKrqxvpUzn";
        } else {
            if (!tronWeb.isAddress(tronWeb.defaultAddress.base58)) {
                window.tronWeb.defaultAddress.hex = tronWeb.address.toHex(state.address);
                window.tronWeb.defaultAddress.base58 = state.address;
            }
        }

        window.tronWeb.fullNode.host = "https://api.trongrid.io";
        window.tronWeb.solidityNode.host = "https://api.trongrid.io";
        window.tronWeb.eventServer.host = "https://api.trongrid.io";

        window.tronWeb.fullNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        window.tronWeb.solidityNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        window.tronWeb.eventServer.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        try { window.tronWeb.setHeader({ "TRON-PRO-API-KEY": "d35618c0-9232-4389-a674-d4ac63fff94b" }); } catch (ex) {}
        contract_address = tronWeb.address.fromHex(artifact.networks['*'].address);
        state.contract_address = contract_address;
        contract_url = state.tron_domain + "/#/contract/" + contract_address;
        var show_msg = '<a href="' + my_address_link + '" target="_blank">' + state.address + '</a>';
        if (tronWeb.isAddress(state.address)) {
            show_msg = '<a href="' + my_address_link + '" target="_blank">' + state.address.substring(0, 7) + "..." + state.address.substring(state.address.length - 4) + '</a>';
        }
        //??????????????????
        $(".header_right p").html(show_msg);
    }
    contract_url = jQuery(".view_contract").attr("href", contract_url);
    navMenu();



    if (state.wallet_type != "web3") {
        contract = tronWeb.contract(artifact.abi, contract_address);
        contract.getOwner().call().then(output => {
            console.log("getOwner", output);
            let owner = tronWeb.address.fromHex(output);
            state.owner = owner;

        });
        contract.BuyGameEvent().watch((err, event) => {
            if (err) {
                return console.error('Error with "method" event:', err);
            }
            if (event) {
                InitPage();
            }
        });
        InitPage();
    }
}

function WriteLog(msg) {
    console.log(msg);
}

function GetGameRoundInfo() {
    if (state.wallet_type != "web3") {
        let tronWeb = window.tronWeb;
        tronWeb.fullNode.host = "https://api.trongrid.io";
        tronWeb.solidityNode.host = "https://api.trongrid.io";
        tronWeb.eventServer.host = "https://api.trongrid.io";

        tronWeb.fullNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        tronWeb.solidityNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        tronWeb.eventServer.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        if (!tronWeb.isAddress(state.address)) {
            tronWeb.defaultAddress.hex = "41bb41c18a6540fde254878c60b6fc4b78b365d228";
            tronWeb.defaultAddress.base58 = "TT3L8jqyuRrM1YqiVvMFZFmNnKrqxvpUzn";


        }
        tronWeb.eventServer.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        contract.getCurrentRoundInfo().call().then(output => {
            WriteLog("??????????????????:" + JSON.stringify(output));
            BindPage(output);
        });
        contract.getDecimals().call().then(output => {
            state.decimals = tronWeb.toDecimal(output);
            WriteLog("????????????:" + tronWeb.toDecimal(output));
        });
    } else {
        contract.methods.getCurrentRoundInfo().call().then(output => {
            WriteLog("??????????????????:" + JSON.stringify(output));
            BindPage(output);
        });
        contract.methods.getDecimals().call().then(output => {
            state.decimals = output;
            WriteLog("????????????:" + output);
        });
    }
}

function BuyToken() {
    if (state.wallet_type != "web3") {
        let tronWeb = window.tronWeb;
        if (!tronWeb.isAddress(state.address)) {

            var r = confirm("??????????????????,?????????????????????????????????!");
            if (r == true) {
                InitMyWallet();
                return;
            }
        }
        tronWeb.eventServer.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        var recommend_user = $.query.get('p');
        if (!recommend_user || recommend_user == "") {
            recommend_user = state.owner;
        }
        if (!tronWeb.isAddress(recommend_user)) {
            recommend_user = state.owner;
        }
        if (state.wallet_type == "imtoken") {

            var params = {
                to: state.contract_address,
                from: state.address,
                value: state.price,
                memo: "buy game",
                feeCustomizable: true,
                recommend_user: recommend_user,
                feeLimit: 100000000,
            };

            imToken.callAPI("buy_token", params, function(err, signature) {
                if (err) {
                    alert(err.message);
                } else {
                    alert(signature);
                }
            });



        } else {
            contract.buy_token(recommend_user).send({
                feeLimit: 100000000,
                callValue: state.price,
                shouldPollResponse: true
            }).then(output => {
                WriteLog("????????????:" + JSON.stringify(output));
                if (output.success) { InitPage(); } else {
                    alert("Please refresh the page and try again")
                }
            });
        }
        return false;
    } else {
        if (!web3_obj.utils.isAddress(state.address)) {

            var r = confirm("??????????????????,?????????????????????????????????!");
            if (r == true) {
                InitMyWallet();
                return;
            }


        }
        var recommend_user = $.query.get('p');
        if (!recommend_user || recommend_user == "") {
            recommend_user = state.owner;
        }
        if (!web3_obj.utils.isAddress(recommend_user)) {
            recommend_user = state.owner;
        }

        contract.methods.askprice().call().then(output => {
            state.price = web3_obj.utils.fromWei(output, 'ether');
            $("span.info_price").html(state.price);
            $("input.btn_price").val(state.price);
            WriteLog(output, "????????????:" + state.price + "BNB");

            contract.methods.buy_token(recommend_user).send({ from: state.address, value: web3_obj.utils.toWei(state.price, 'ether') }, function(error, transactionHash) {
                InitPage();
            });
        });

    }
}

function BindPage(output) {
    //????????????
    $("#game_name").html(output.name);
    //??????????????????+??????????????????
    var show_msg = "??????????????????";

    var game_times = 0;
    var over_time = 0;
    var current_time = (new Date()).getTime();
    var left_seconds = 0;
    if (state.wallet_type != "web3") {
        if (tronWeb.isAddress(output.last_buy_user_address)) {
            var last_buy_user_address = tronWeb.address.fromHex(output.last_buy_user_address);
            var address_link = state.tron_domain + "/#/address/" + last_buy_user_address;
            show_msg = '<a  class="h6-font font-w--200 text-color--200" href="' + address_link + '" target="_blank">' + last_buy_user_address.substring(0, 7) + "..." + last_buy_user_address.substring(last_buy_user_address.length - 4) + "</a>";
        }
        game_times = tronWeb.toDecimal(output.game_times);
        over_time = tronWeb.toDecimal(output.over_time) * 1000;
    } else {
        game_times = parseInt(output.game_times);

        over_time = parseInt(output.over_time) * 1000;



    }
    left_seconds = parseInt(math.chain(over_time).subtract(current_time).divide(1000).done());

    //????????????????????????
    $("#date").data("date", over_time);
    countDown();
    var dataProgressHorizon = (left_seconds * 100 / game_times).toFixed(2)
    $("#date_progress").data("progress-horizon", dataProgressHorizon);

    $("#date_progress").css("width", "" + dataProgressHorizon + "%");

    var prize_value = 0;
    if (state.wallet_type != "web3") {
        prize_value = math.chain(tronWeb.toDecimal(output.prize_value)).divide(math.pow(10, 6)).done();
    } else {
        prize_value = web3_obj.utils.fromWei(output.prize_value, 'ether');

    }
    $("#prize_value").html(prize_value);





    var buy_count = 0;
    if (state.wallet_type != "web3") {
        buy_count = tronWeb.toDecimal(output.buy_count);
    } else {
        buy_count = output.buy_count;
    }
    $("#join_member").html(buy_count);
    var bonus_value = 0;

    if (state.wallet_type != "web3") {
        bonus_value = math.chain(tronWeb.toDecimal(output.bonus_value)).divide(math.pow(10, 6)).done();
    } else {
        bonus_value = web3_obj.utils.fromWei(output.bonus_value, 'ether');
    }
    $("#total_bonus").html(bonus_value);
    var last_info = show_msg;
    $("#last_user").html(last_info);
    $("#last_time").html(new Date(parseInt(output.last_buy_time) * 1000));

    var price = 0;
    if (state.wallet_type != "web3") {
        price = math.chain(tronWeb.toDecimal(output.price)).divide(math.pow(10, 6)).done();
    } else {
        price = web3_obj.utils.fromWei(output.price, 'ether');
    }


    $("span.info_price").html(price);
    $("input.btn_price").val(price);


}

function InitPage() {

    $(".buy_now").bind("click", BuyToken);
    $("#loading").show();
    if (state.wallet_type != "web3") {
        let tronWeb = window.tronWeb;
        tronWeb.fullNode.host = "https://api.trongrid.io";
        tronWeb.solidityNode.host = "https://api.trongrid.io";
        tronWeb.eventServer.host = "https://api.trongrid.io";

        tronWeb.fullNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        tronWeb.solidityNode.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";
        tronWeb.eventServer.headers["TRON-PRO-API-KEY"] = "d35618c0-9232-4389-a674-d4ac63fff94b";

        if (!tronWeb.isAddress(state.address)) {
            tronWeb.defaultAddress.hex = "41bb41c18a6540fde254878c60b6fc4b78b365d228";
            tronWeb.defaultAddress.base58 = "TT3L8jqyuRrM1YqiVvMFZFmNnKrqxvpUzn";


        }

        if (tronWeb.isAddress(state.address)) {
            //??????????????????
            tronWeb.trx.getBalance(state.address).then(function(Balance) {
                var Balance_format = math.chain(Balance).divide(math.pow(10, 6)).done();
                $(".header_right strong").html(Balance_format + " TRX ");
                console.log("????????????:" + Balance_format);
            });
        } else {
            $(".header_right strong").html("Loading TRX ");
        }
        if (tronWeb.isAddress(state.address)) {
            contract.getBuerIncomeInvestment(state.address).call().then(output => {
                var user_have_count = tronWeb.toDecimal(output.buy_count);
                var investment = math.chain(tronWeb.toDecimal(output.investment)).divide(math.pow(10, 6)).done();
                var recommend_value = math.chain(tronWeb.toDecimal(output.recommend_value)).divide(math.pow(10, 6)).done();
                var income = math.chain(tronWeb.toDecimal(output.income)).divide(math.pow(10, 6)).done();
                $("#user_have_count").html(user_have_count);
                $("#user_income_value").html(income);
                $("#user_investment_value").html(investment);
                $("#user_recommend_value").html(recommend_value);
                if (user_have_count > 0) {
                    var page_name = "";
                    if (window.location.pathname.indexOf("index.html") < 0) {
                        page_name = "index.html";
                    }
                    var link_str = window.location.origin + window.location.pathname + page_name + "?p=" + state.address;
                    $("#recommond_link h6 a.a_link").html(link_str);
                    $("#recommond_link h6 a.a_link").attr("href", link_str);


                    $("#btn_copy").data("clipboard-text", link_str);
                    var clipboard = new Clipboard('#btn_copy', {
                        text: function() {
                            if (state.wallet_type == "imtoken") {
                                imToken.callAPI('native.setClipboard', link_str);
                            }
                            return link_str;
                        }
                    });
                    clipboard.on('success', function(e) {
                        console.log(e);
                    });

                    clipboard.on('error', function(e) {
                        console.log(e);
                    });
                    $("#recommond_link").attr("style", "display:flex !important");
                } else {
                    $("#recommond_link").attr("style", "display:none !important");
                }
            });

            contract.balanceOf(state.address).call().then(output => {
                var leela_handle = math.chain(tronWeb.toDecimal(output)).divide(math.pow(10, 6)).done();
                $("#leela_handle").html(leela_handle);
                WriteLog("balanceOf:" + output);
            });
        } else {
            $("#recommond_link").attr("style", "display:none !important");
            $("#user_have_count").html("0");
            $("#user_income_value").html("0");
            $("#user_investment_value").html("0");
            $("#user_recommend_value").html("0");

            $("#leela_handle").html("0");
        }


        contract.symbol().call().then(output => {
            $("#leela_symbol").html(output);
            WriteLog("symbol:" + output);
        });

        contract.totalSupply().call().then(output => {
            var leela_totalsupply = math.chain(tronWeb.toDecimal(output)).divide(math.pow(10, 6)).done();
            $("#leela_totalsupply").html(leela_totalsupply);
            WriteLog("totalsupply:" + output);
        });


        contract.askprice().call().then(output => {
            state.price = tronWeb.toDecimal(output.price);


            WriteLog("????????????:" + (state.price / (Math.pow(10, state.decimals))) + "RTX");
        });
    } else {
        if (web3_obj.utils.isAddress(state.address)) {
            contract.methods.getBuerIncomeInvestment(state.address).call().then(output => {
                console.log(output)

                var user_have_count = output.buy_count;
                var investment = web3_obj.utils.fromWei(output.investment, 'ether');
                var recommend_value = web3_obj.utils.fromWei(output.recommend_value, 'ether');
                var income = web3_obj.utils.fromWei(output.income, 'ether');
                $("#user_have_count").html(user_have_count);
                $("#user_income_value").html(income);
                $("#user_investment_value").html(investment);
                $("#user_recommend_value").html(recommend_value);
                if (user_have_count > 0) {
                    var page_name = "";
                    if (window.location.pathname.indexOf("index.html") < 0) {
                        page_name = "index.html";
                    }
                    var link_str = window.location.origin + window.location.pathname + page_name + "?p=" + state.address;
                    $("#recommond_link h6 a.a_link").html(link_str);
                    $("#recommond_link h6 a.a_link").attr("href", link_str);


                    $("#btn_copy").data("clipboard-text", link_str);
                    var clipboard = new Clipboard('#btn_copy', {
                        text: function() {
                            if (state.wallet_type == "imtoken") {
                                imToken.callAPI('native.setClipboard', link_str);
                            }
                            return link_str;
                        }
                    });
                    clipboard.on('success', function(e) {
                        console.log(e);
                    });

                    clipboard.on('error', function(e) {
                        console.log(e);
                    });
                    $("#recommond_link").attr("style", "display:flex !important");
                } else {
                    $("#recommond_link").attr("style", "display:none !important");
                }
            });
            contract.methods.balanceOf(state.address).call().then(output => {

                var leela_handle = web3_obj.utils.fromWei(output, 'ether');
                $("#leela_handle").html(leela_handle);
                WriteLog("balanceOf:" + output);
            });
            contract.methods.totalSupply().call().then(output => {
                var leela_totalsupply = web3_obj.utils.fromWei(output, 'ether');

                $("#leela_totalsupply").html(leela_totalsupply);
                WriteLog("totalsupply:" + output);
            });

            contract.methods.askprice().call().then(output => {
                state.price = web3_obj.utils.fromWei(output, 'ether');
                $("span.info_price").html(state.price);
                $("input.btn_price").val(state.price);
                WriteLog(output, "????????????:" + state.price + "BNB");
            });


        } else {
            $("#recommond_link").attr("style", "display:none !important");
            $("#user_have_count").html("0");
            $("#user_income_value").html("0");
            $("#user_investment_value").html("0");
            $("#user_recommend_value").html("0");

            $("#leela_handle").html("0");
        }

        contract.methods.symbol().call().then(output => {
            $("#leela_symbol").html(output);
            WriteLog("symbol:" + output);
        });
    }
    $("#loading").hide();
    GetGameRoundInfo();



}
var contract = null;
var base_contract_address = "0x71d0e1ecf9b18c39003ea4995623e133127f0c6b";
var state = {
    address: null,
    balance: null,
    contract: null,
    tokenBalance: null,
    decimals: 6,
    price: 0,
    game_info: {},
    owner: "",
    tron_domain: "https://tronscan.io",
    wallet_type: "",
    contract_address: ""
};

var artifact = {};

var web3_obj;

function waitForGlobal(call_back) {
    if (!!window.imToken) {
        //alert("ImToKen");
        state.wallet_type = "imtoken";

        window.tronWeb = new TronWeb({
            fullNode: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io',
            headers: { "TRON-PRO-API-KEY": 'd35618c0-9232-4389-a674-d4ac63fff94b' },
        });
        call_back();
    } else if (!!window.tronWeb) {

        window.tronWeb = new TronWeb({
            fullNode: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io',
            headers: { "TRON-PRO-API-KEY": 'd35618c0-9232-4389-a674-d4ac63fff94b' },
        });
        state.wallet_type = "tronweb";
        call_back();
        $("#base_header_lian a").html("Tron(??????)");
        $("#base_header_lian a").attr("href", "https://tron.network/");
    } else if (!!window.Web3) {
        state.wallet_type = "web3";
        getWeb3().then(async res => {
            web3_obj = res;
            call_back();
        });
        $("#base_header_lian a").html("BSC(????????????)");
        $("#base_header_lian a").attr("href", "https://bscscan.com/");
        state.tron_domain = "https://testnet.bscscan.com";

        ethereum.on('accountsChanged', function(accounts) {
            window.location.reload();
        });

    }


}



const getWeb3 = () =>
    new Promise(async(resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.

        // Modern dapp browsers...
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Acccounts now exposed
                resolve(web3);
            } catch (error) {
                reject(error);
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
            const provider = new Web3.providers.HttpProvider(
                "https://data-seed-prebsc-1-s1.binance.org:8545"
            );
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
            resolve(web3);
        }

    });

function addZero(e, t) {
    for (var i = "" + e; i.length < t;)
        i = "0" + i;
    return i
}! function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document)
                throw new Error("jQuery requires a window with a document");
            return t(e)
        } :
        t(e)
}("undefined" != typeof window ? window : this, function(k, e) {
    "use strict";
    var t = [],
        T = k.document,
        n = Object.getPrototypeOf,
        a = t.slice,
        g = t.concat,
        l = t.push,
        o = t.indexOf,
        i = {},
        r = i.toString,
        v = i.hasOwnProperty,
        s = v.toString,
        c = s.call(Object),
        m = {},
        y = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        b = function(e) {
            return null != e && e === e.window
        },
        d = {
            type: !0,
            src: !0,
            noModule: !0
        };

    function w(e, t, i) {
        var n, o = (t = t || T).createElement("script");
        if (o.text = e,
            i)
            for (n in d)
                i[n] && (o[n] = i[n]);
        t.head.appendChild(o).parentNode.removeChild(o)
    }

    function x(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? i[r.call(e)] || "object" : typeof e
    }
    var S = function(e, t) {
            return new S.fn.init(e, t)
        },
        u = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function f(e) {
        var t = !!e && "length" in e && e.length,
            i = x(e);
        return !y(e) && !b(e) && ("array" === i || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    S.fn = S.prototype = {
            jquery: "3.3.1",
            constructor: S,
            length: 0,
            toArray: function() {
                return a.call(this)
            },
            get: function(e) {
                return null == e ? a.call(this) : e < 0 ? this[e + this.length] : this[e]
            },
            pushStack: function(e) {
                var t = S.merge(this.constructor(), e);
                return t.prevObject = this,
                    t
            },
            each: function(e) {
                return S.each(this, e)
            },
            map: function(i) {
                return this.pushStack(S.map(this, function(e, t) {
                    return i.call(e, t, e)
                }))
            },
            slice: function() {
                return this.pushStack(a.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length,
                    i = +e + (e < 0 ? t : 0);
                return this.pushStack(0 <= i && i < t ? [this[i]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: l,
            sort: t.sort,
            splice: t.splice
        },
        S.extend = S.fn.extend = function() {
            var e, t, i, n, o, r, s = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1;
            for ("boolean" == typeof s && (c = s,
                    s = arguments[a] || {},
                    a++),
                "object" == typeof s || y(s) || (s = {}),
                a === l && (s = this,
                    a--); a < l; a++)
                if (null != (e = arguments[a]))
                    for (t in e)
                        i = s[t],
                        s !== (n = e[t]) && (c && n && (S.isPlainObject(n) || (o = Array.isArray(n))) ? (r = o ? (o = !1,
                                i && Array.isArray(i) ? i : []) : i && S.isPlainObject(i) ? i : {},
                            s[t] = S.extend(c, r, n)) : void 0 !== n && (s[t] = n));
            return s
        },
        S.extend({
            expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isPlainObject: function(e) {
                var t, i;
                return !(!e || "[object Object]" !== r.call(e) || (t = n(e)) && ("function" != typeof(i = v.call(t, "constructor") && t.constructor) || s.call(i) !== c))
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            },
            globalEval: function(e) {
                w(e)
            },
            each: function(e, t) {
                var i, n = 0;
                if (f(e))
                    for (i = e.length; n < i && !1 !== t.call(e[n], n, e[n]); n++)
                ;
                else
                    for (n in e)
                        if (!1 === t.call(e[n], n, e[n]))
                            break;
                return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(u, "")
            },
            makeArray: function(e, t) {
                var i = t || [];
                return null != e && (f(Object(e)) ? S.merge(i, "string" == typeof e ? [e] : e) : l.call(i, e)),
                    i
            },
            inArray: function(e, t, i) {
                return null == t ? -1 : o.call(t, e, i)
            },
            merge: function(e, t) {
                for (var i = +t.length, n = 0, o = e.length; n < i; n++)
                    e[o++] = t[n];
                return e.length = o,
                    e
            },
            grep: function(e, t, i) {
                for (var n = [], o = 0, r = e.length, s = !i; o < r; o++)
                    !t(e[o], o) !== s && n.push(e[o]);
                return n
            },
            map: function(e, t, i) {
                var n, o, r = 0,
                    s = [];
                if (f(e))
                    for (n = e.length; r < n; r++)
                        null != (o = t(e[r], r, i)) && s.push(o);
                else
                    for (r in e)
                        null != (o = t(e[r], r, i)) && s.push(o);
                return g.apply([], s)
            },
            guid: 1,
            support: m
        }),
        "function" == typeof Symbol && (S.fn[Symbol.iterator] = t[Symbol.iterator]),
        S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
            i["[object " + t + "]"] = t.toLowerCase()
        });
    var p = function(i) {
        var e, p, w, r, o, h, u, g, x, l, c, _, k, s, T, v, a, d, m, S = "sizzle" + 1 * new Date,
            y = i.document,
            E = 0,
            n = 0,
            f = se(),
            b = se(),
            C = se(),
            A = function(e, t) {
                return e === t && (c = !0),
                    0
            },
            O = {}.hasOwnProperty,
            t = [],
            D = t.pop,
            N = t.push,
            L = t.push,
            I = t.slice,
            j = function(e, t) {
                for (var i = 0, n = e.length; i < n; i++)
                    if (e[i] === t)
                        return i;
                return -1
            },
            $ = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            M = "[\\x20\\t\\r\\n\\f]",
            P = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            H = "\\[" + M + "*(" + P + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + P + "))|)" + M + "*\\]",
            q = ":(" + P + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + H + ")*)|.*)\\)|)",
            W = new RegExp(M + "+", "g"),
            R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
            F = new RegExp("^" + M + "*," + M + "*"),
            z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
            B = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]", "g"),
            U = new RegExp(q),
            V = new RegExp("^" + P + "$"),
            Y = {
                ID: new RegExp("^#(" + P + ")"),
                CLASS: new RegExp("^\\.(" + P + ")"),
                TAG: new RegExp("^(" + P + "|[*])"),
                ATTR: new RegExp("^" + H),
                PSEUDO: new RegExp("^" + q),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + $ + ")$", "i"),
                needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
            },
            X = /^(?:input|select|textarea|button)$/i,
            Q = /^h\d$/i,
            K = /^[^{]+\{\s*\[native \w/,
            G = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            Z = /[+~]/,
            J = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
            ee = function(e, t, i) {
                var n = "0x" + t - 65536;
                return n != n || i ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
            },
            te = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            ie = function(e, t) {
                return t ? "\0" === e ? "???" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            ne = function() {
                _()
            },
            oe = ye(function(e) {
                return !0 === e.disabled && ("form" in e || "label" in e)
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            L.apply(t = I.call(y.childNodes), y.childNodes),
                t[y.childNodes.length].nodeType
        } catch (i) {
            L = {
                apply: t.length ? function(e, t) {
                    N.apply(e, I.call(t))
                } : function(e, t) {
                    for (var i = e.length, n = 0; e[i++] = t[n++];)
                    ;
                    e.length = i - 1
                }
            }
        }

        function re(e, t, i, n) {
            var o, r, s, a, l, c, d, u = t && t.ownerDocument,
                f = t ? t.nodeType : 9;
            if (i = i || [],
                "string" != typeof e || !e || 1 !== f && 9 !== f && 11 !== f)
                return i;
            if (!n && ((t ? t.ownerDocument || t : y) !== k && _(t),
                    t = t || k,
                    T)) {
                if (11 !== f && (l = G.exec(e)))
                    if (o = l[1]) {
                        if (9 === f) {
                            if (!(s = t.getElementById(o)))
                                return i;
                            if (s.id === o)
                                return i.push(s),
                                    i
                        } else if (u && (s = u.getElementById(o)) && m(t, s) && s.id === o)
                            return i.push(s),
                                i
                    } else {
                        if (l[2])
                            return L.apply(i, t.getElementsByTagName(e)),
                                i;
                        if ((o = l[3]) && p.getElementsByClassName && t.getElementsByClassName)
                            return L.apply(i, t.getElementsByClassName(o)),
                                i
                    }
                if (p.qsa && !C[e + " "] && (!v || !v.test(e))) {
                    if (1 !== f)
                        u = t,
                        d = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(te, ie) : t.setAttribute("id", a = S),
                            r = (c = h(e)).length; r--;)
                            c[r] = "#" + a + " " + me(c[r]);
                        d = c.join(","),
                            u = Z.test(e) && ge(t.parentNode) || t
                    }
                    if (d)
                        try {
                            return L.apply(i, u.querySelectorAll(d)),
                                i
                        } catch (e) {} finally {
                            a === S && t.removeAttribute("id")
                        }
                }
            }
            return g(e.replace(R, "$1"), t, i, n)
        }

        function se() {
            var n = [];
            return function e(t, i) {
                return n.push(t + " ") > w.cacheLength && delete e[n.shift()],
                    e[t + " "] = i
            }
        }

        function ae(e) {
            return e[S] = !0,
                e
        }

        function le(e) {
            var t = k.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                    t = null
            }
        }

        function ce(e, t) {
            for (var i = e.split("|"), n = i.length; n--;)
                w.attrHandle[i[n]] = t
        }

        function de(e, t) {
            var i = t && e,
                n = i && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (n)
                return n;
            if (i)
                for (; i = i.nextSibling;)
                    if (i === t)
                        return -1;
            return e ? 1 : -1
        }

        function ue(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }

        function fe(i) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === i
            }
        }

        function pe(t) {
            return function(e) {
                return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && oe(e) === t : e.disabled === t : "label" in e && e.disabled === t
            }
        }

        function he(s) {
            return ae(function(r) {
                return r = +r,
                    ae(function(e, t) {
                        for (var i, n = s([], e.length, r), o = n.length; o--;)
                            e[i = n[o]] && (e[i] = !(t[i] = e[i]))
                    })
            })
        }

        function ge(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        for (e in p = re.support = {},
            o = re.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            },
            _ = re.setDocument = function(e) {
                var t, i, n = e ? e.ownerDocument || e : y;
                return n !== k && 9 === n.nodeType && n.documentElement && (s = (k = n).documentElement,
                        T = !o(k),
                        y !== k && (i = k.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", ne, !1) : i.attachEvent && i.attachEvent("onunload", ne)),
                        p.attributes = le(function(e) {
                            return e.className = "i", !e.getAttribute("className")
                        }),
                        p.getElementsByTagName = le(function(e) {
                            return e.appendChild(k.createComment("")), !e.getElementsByTagName("*").length
                        }),
                        p.getElementsByClassName = K.test(k.getElementsByClassName),
                        p.getById = le(function(e) {
                            return s.appendChild(e).id = S, !k.getElementsByName || !k.getElementsByName(S).length
                        }),
                        p.getById ? (w.filter.ID = function(e) {
                                var t = e.replace(J, ee);
                                return function(e) {
                                    return e.getAttribute("id") === t
                                }
                            },
                            w.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && T) {
                                    var i = t.getElementById(e);
                                    return i ? [i] : []
                                }
                            }
                        ) : (w.filter.ID = function(e) {
                                var i = e.replace(J, ee);
                                return function(e) {
                                    var t = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                                    return t && t.value === i
                                }
                            },
                            w.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && T) {
                                    var i, n, o, r = t.getElementById(e);
                                    if (r) {
                                        if ((i = r.getAttributeNode("id")) && i.value === e)
                                            return [r];
                                        for (o = t.getElementsByName(e),
                                            n = 0; r = o[n++];)
                                            if ((i = r.getAttributeNode("id")) && i.value === e)
                                                return [r]
                                    }
                                    return []
                                }
                            }
                        ),
                        w.find.TAG = p.getElementsByTagName ? function(e, t) {
                            return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : p.qsa ? t.querySelectorAll(e) : void 0
                        } :
                        function(e, t) {
                            var i, n = [],
                                o = 0,
                                r = t.getElementsByTagName(e);
                            if ("*" !== e)
                                return r;
                            for (; i = r[o++];)
                                1 === i.nodeType && n.push(i);
                            return n
                        },
                        w.find.CLASS = p.getElementsByClassName && function(e, t) {
                            if (void 0 !== t.getElementsByClassName && T)
                                return t.getElementsByClassName(e)
                        },
                        a = [],
                        v = [],
                        (p.qsa = K.test(k.querySelectorAll)) && (le(function(e) {
                                s.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                                    e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"),
                                    e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + $ + ")"),
                                    e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="),
                                    e.querySelectorAll(":checked").length || v.push(":checked"),
                                    e.querySelectorAll("a#" + S + "+*").length || v.push(".#.+[+~]")
                            }),
                            le(function(e) {
                                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                                var t = k.createElement("input");
                                t.setAttribute("type", "hidden"),
                                    e.appendChild(t).setAttribute("name", "D"),
                                    e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="),
                                    2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"),
                                    s.appendChild(e).disabled = !0,
                                    2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"),
                                    e.querySelectorAll("*,:x"),
                                    v.push(",.*:")
                            })),
                        (p.matchesSelector = K.test(d = s.matches || s.webkitMatchesSelector || s.mozMatchesSelector || s.oMatchesSelector || s.msMatchesSelector)) && le(function(e) {
                            p.disconnectedMatch = d.call(e, "*"),
                                d.call(e, "[s!='']:x"),
                                a.push("!=", q)
                        }),
                        v = v.length && new RegExp(v.join("|")),
                        a = a.length && new RegExp(a.join("|")),
                        t = K.test(s.compareDocumentPosition),
                        m = t || K.test(s.contains) ? function(e, t) {
                            var i = 9 === e.nodeType ? e.documentElement : e,
                                n = t && t.parentNode;
                            return e === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
                        } :
                        function(e, t) {
                            if (t)
                                for (; t = t.parentNode;)
                                    if (t === e)
                                        return !0;
                            return !1
                        },
                        A = t ? function(e, t) {
                            if (e === t)
                                return c = !0,
                                    0;
                            var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                            return i || (1 & (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !p.sortDetached && t.compareDocumentPosition(e) === i ? e === k || e.ownerDocument === y && m(y, e) ? -1 : t === k || t.ownerDocument === y && m(y, t) ? 1 : l ? j(l, e) - j(l, t) : 0 : 4 & i ? -1 : 1)
                        } :
                        function(e, t) {
                            if (e === t)
                                return c = !0,
                                    0;
                            var i, n = 0,
                                o = e.parentNode,
                                r = t.parentNode,
                                s = [e],
                                a = [t];
                            if (!o || !r)
                                return e === k ? -1 : t === k ? 1 : o ? -1 : r ? 1 : l ? j(l, e) - j(l, t) : 0;
                            if (o === r)
                                return de(e, t);
                            for (i = e; i = i.parentNode;)
                                s.unshift(i);
                            for (i = t; i = i.parentNode;)
                                a.unshift(i);
                            for (; s[n] === a[n];)
                                n++;
                            return n ? de(s[n], a[n]) : s[n] === y ? -1 : a[n] === y ? 1 : 0
                        }
                    ),
                    k
            },
            re.matches = function(e, t) {
                return re(e, null, null, t)
            },
            re.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== k && _(e),
                    t = t.replace(B, "='$1']"),
                    p.matchesSelector && T && !C[t + " "] && (!a || !a.test(t)) && (!v || !v.test(t)))
                    try {
                        var i = d.call(e, t);
                        if (i || p.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                            return i
                    } catch (e) {}
                return 0 < re(t, k, null, [e]).length
            },
            re.contains = function(e, t) {
                return (e.ownerDocument || e) !== k && _(e),
                    m(e, t)
            },
            re.attr = function(e, t) {
                (e.ownerDocument || e) !== k && _(e);
                var i = w.attrHandle[t.toLowerCase()],
                    n = i && O.call(w.attrHandle, t.toLowerCase()) ? i(e, t, !T) : void 0;
                return void 0 !== n ? n : p.attributes || !T ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
            },
            re.escape = function(e) {
                return (e + "").replace(te, ie)
            },
            re.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            },
            re.uniqueSort = function(e) {
                var t, i = [],
                    n = 0,
                    o = 0;
                if (c = !p.detectDuplicates,
                    l = !p.sortStable && e.slice(0),
                    e.sort(A),
                    c) {
                    for (; t = e[o++];)
                        t === e[o] && (n = i.push(o));
                    for (; n--;)
                        e.splice(i[n], 1)
                }
                return l = null,
                    e
            },
            r = re.getText = function(e) {
                var t, i = "",
                    n = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent)
                            return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling)
                            i += r(e)
                    } else if (3 === o || 4 === o)
                        return e.nodeValue
                } else
                    for (; t = e[n++];)
                        i += r(t);
                return i
            },
            (w = re.selectors = {
                cacheLength: 50,
                createPseudo: ae,
                match: Y,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(J, ee),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(J, ee),
                            "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || re.error(e[0]),
                                e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                                e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && re.error(e[0]),
                            e
                    },
                    PSEUDO: function(e) {
                        var t, i = !e[6] && e[2];
                        return Y.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : i && U.test(i) && (t = h(i, !0)) && (t = i.indexOf(")", i.length - t) - i.length) && (e[0] = e[0].slice(0, t),
                                e[2] = i.slice(0, t)),
                            e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(J, ee).toLowerCase();
                        return "*" === e ? function() {
                                return !0
                            } :
                            function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                    },
                    CLASS: function(e) {
                        var t = f[e + " "];
                        return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && f(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(i, n, o) {
                        return function(e) {
                            var t = re.attr(e, i);
                            return null == t ? "!=" === n : !n || (t += "",
                                "=" === n ? t === o : "!=" === n ? t !== o : "^=" === n ? o && 0 === t.indexOf(o) : "*=" === n ? o && -1 < t.indexOf(o) : "$=" === n ? o && t.slice(-o.length) === o : "~=" === n ? -1 < (" " + t.replace(W, " ") + " ").indexOf(o) : "|=" === n && (t === o || t.slice(0, o.length + 1) === o + "-"))
                        }
                    },
                    CHILD: function(h, e, t, g, v) {
                        var m = "nth" !== h.slice(0, 3),
                            y = "last" !== h.slice(-4),
                            b = "of-type" === e;
                        return 1 === g && 0 === v ? function(e) {
                                return !!e.parentNode
                            } :
                            function(e, t, i) {
                                var n, o, r, s, a, l, c = m !== y ? "nextSibling" : "previousSibling",
                                    d = e.parentNode,
                                    u = b && e.nodeName.toLowerCase(),
                                    f = !i && !b,
                                    p = !1;
                                if (d) {
                                    if (m) {
                                        for (; c;) {
                                            for (s = e; s = s[c];)
                                                if (b ? s.nodeName.toLowerCase() === u : 1 === s.nodeType)
                                                    return !1;
                                            l = c = "only" === h && !l && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (l = [y ? d.firstChild : d.lastChild],
                                        y && f) {
                                        for (p = (a = (n = (o = (r = (s = d)[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] || [])[0] === E && n[1]) && n[2],
                                            s = a && d.childNodes[a]; s = ++a && s && s[c] || (p = a = 0) || l.pop();)
                                            if (1 === s.nodeType && ++p && s === e) {
                                                o[h] = [E, a, p];
                                                break
                                            }
                                    } else if (f && (p = a = (n = (o = (r = (s = e)[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] || [])[0] === E && n[1]), !1 === p)
                                        for (;
                                            (s = ++a && s && s[c] || (p = a = 0) || l.pop()) && ((b ? s.nodeName.toLowerCase() !== u : 1 !== s.nodeType) || !++p || (f && ((o = (r = s[S] || (s[S] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[h] = [E, p]),
                                                s !== e));)
                                    ;
                                    return (p -= v) === g || p % g == 0 && 0 <= p / g
                                }
                            }
                    },
                    PSEUDO: function(e, r) {
                        var t, s = w.pseudos[e] || w.setFilters[e.toLowerCase()] || re.error("unsupported pseudo: " + e);
                        return s[S] ? s(r) : 1 < s.length ? (t = [e, e, "", r],
                            w.setFilters.hasOwnProperty(e.toLowerCase()) ? ae(function(e, t) {
                                for (var i, n = s(e, r), o = n.length; o--;)
                                    e[i = j(e, n[o])] = !(t[i] = n[o])
                            }) : function(e) {
                                return s(e, 0, t)
                            }
                        ) : s
                    }
                },
                pseudos: {
                    not: ae(function(e) {
                        var n = [],
                            o = [],
                            a = u(e.replace(R, "$1"));
                        return a[S] ? ae(function(e, t, i, n) {
                            for (var o, r = a(e, null, n, []), s = e.length; s--;)
                                (o = r[s]) && (e[s] = !(t[s] = o))
                        }) : function(e, t, i) {
                            return n[0] = e,
                                a(n, null, i, o),
                                n[0] = null, !o.pop()
                        }
                    }),
                    has: ae(function(t) {
                        return function(e) {
                            return 0 < re(t, e).length
                        }
                    }),
                    contains: ae(function(t) {
                        return t = t.replace(J, ee),
                            function(e) {
                                return -1 < (e.textContent || e.innerText || r(e)).indexOf(t)
                            }
                    }),
                    lang: ae(function(i) {
                        return V.test(i || "") || re.error("unsupported lang: " + i),
                            i = i.replace(J, ee).toLowerCase(),
                            function(e) {
                                var t;
                                do {
                                    if (t = T ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                        return (t = t.toLowerCase()) === i || 0 === t.indexOf(i + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var t = i.location && i.location.hash;
                        return t && t.slice(1) === e.id
                    },
                    root: function(e) {
                        return e === s
                    },
                    focus: function(e) {
                        return e === k.activeElement && (!k.hasFocus || k.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: pe(!1),
                    disabled: pe(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !w.pseudos.empty(e)
                    },
                    header: function(e) {
                        return Q.test(e.nodeName)
                    },
                    input: function(e) {
                        return X.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: he(function() {
                        return [0]
                    }),
                    last: he(function(e, t) {
                        return [t - 1]
                    }),
                    eq: he(function(e, t, i) {
                        return [i < 0 ? i + t : i]
                    }),
                    even: he(function(e, t) {
                        for (var i = 0; i < t; i += 2)
                            e.push(i);
                        return e
                    }),
                    odd: he(function(e, t) {
                        for (var i = 1; i < t; i += 2)
                            e.push(i);
                        return e
                    }),
                    lt: he(function(e, t, i) {
                        for (var n = i < 0 ? i + t : i; 0 <= --n;)
                            e.push(n);
                        return e
                    }),
                    gt: he(function(e, t, i) {
                        for (var n = i < 0 ? i + t : i; ++n < t;)
                            e.push(n);
                        return e
                    })
                }
            }).pseudos.nth = w.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            })
            w.pseudos[e] = ue(e);
        for (e in {
                submit: !0,
                reset: !0
            })
            w.pseudos[e] = fe(e);

        function ve() {}

        function me(e) {
            for (var t = 0, i = e.length, n = ""; t < i; t++)
                n += e[t].value;
            return n
        }

        function ye(a, e, t) {
            var l = e.dir,
                c = e.next,
                d = c || l,
                u = t && "parentNode" === d,
                f = n++;
            return e.first ? function(e, t, i) {
                    for (; e = e[l];)
                        if (1 === e.nodeType || u)
                            return a(e, t, i);
                    return !1
                } :
                function(e, t, i) {
                    var n, o, r, s = [E, f];
                    if (i) {
                        for (; e = e[l];)
                            if ((1 === e.nodeType || u) && a(e, t, i))
                                return !0
                    } else
                        for (; e = e[l];)
                            if (1 === e.nodeType || u)
                                if (o = (r = e[S] || (e[S] = {}))[e.uniqueID] || (r[e.uniqueID] = {}),
                                    c && c === e.nodeName.toLowerCase())
                                    e = e[l] || e;
                                else {
                                    if ((n = o[d]) && n[0] === E && n[1] === f)
                                        return s[2] = n[2];
                                    if ((o[d] = s)[2] = a(e, t, i))
                                        return !0
                                }
                    return !1
                }
        }

        function be(o) {
            return 1 < o.length ? function(e, t, i) {
                    for (var n = o.length; n--;)
                        if (!o[n](e, t, i))
                            return !1;
                    return !0
                } :
                o[0]
        }

        function we(e, t, i, n, o) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)
                (r = e[a]) && (i && !i(r, n, o) || (s.push(r),
                    c && t.push(a)));
            return s
        }

        function xe(p, h, g, v, m, e) {
            return v && !v[S] && (v = xe(v)),
                m && !m[S] && (m = xe(m, e)),
                ae(function(e, t, i, n) {
                    var o, r, s, a = [],
                        l = [],
                        c = t.length,
                        d = e || function(e, t, i) {
                            for (var n = 0, o = t.length; n < o; n++)
                                re(e, t[n], i);
                            return i
                        }(h || "*", i.nodeType ? [i] : i, []),
                        u = !p || !e && h ? d : we(d, a, p, i, n),
                        f = g ? m || (e ? p : c || v) ? [] : t : u;
                    if (g && g(u, f, i, n),
                        v)
                        for (o = we(f, l),
                            v(o, [], i, n),
                            r = o.length; r--;)
                            (s = o[r]) && (f[l[r]] = !(u[l[r]] = s));
                    if (e) {
                        if (m || p) {
                            if (m) {
                                for (o = [],
                                    r = f.length; r--;)
                                    (s = f[r]) && o.push(u[r] = s);
                                m(null, f = [], o, n)
                            }
                            for (r = f.length; r--;)
                                (s = f[r]) && -1 < (o = m ? j(e, s) : a[r]) && (e[o] = !(t[o] = s))
                        }
                    } else
                        f = we(f === t ? f.splice(c, f.length) : f),
                        m ? m(null, t, f, n) : L.apply(t, f)
                })
        }

        function _e(e) {
            for (var o, t, i, n = e.length, r = w.relative[e[0].type], s = r || w.relative[" "], a = r ? 1 : 0, l = ye(function(e) {
                    return e === o
                }, s, !0), c = ye(function(e) {
                    return -1 < j(o, e)
                }, s, !0), d = [function(e, t, i) {
                    var n = !r && (i || t !== x) || ((o = t).nodeType ? l(e, t, i) : c(e, t, i));
                    return o = null,
                        n
                }]; a < n; a++)
                if (t = w.relative[e[a].type])
                    d = [ye(be(d), t)];
                else {
                    if ((t = w.filter[e[a].type].apply(null, e[a].matches))[S]) {
                        for (i = ++a; i < n && !w.relative[e[i].type]; i++)
                        ;
                        return xe(1 < a && be(d), 1 < a && me(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(R, "$1"), t, a < i && _e(e.slice(a, i)), i < n && _e(e = e.slice(i)), i < n && me(e))
                    }
                    d.push(t)
                }
            return be(d)
        }
        return ve.prototype = w.filters = w.pseudos,
            w.setFilters = new ve,
            h = re.tokenize = function(e, t) {
                var i, n, o, r, s, a, l, c = b[e + " "];
                if (c)
                    return t ? 0 : c.slice(0);
                for (s = e,
                    a = [],
                    l = w.preFilter; s;) {
                    for (r in i && !(n = F.exec(s)) || (n && (s = s.slice(n[0].length) || s),
                            a.push(o = [])),
                        i = !1,
                        (n = z.exec(s)) && (i = n.shift(),
                            o.push({
                                value: i,
                                type: n[0].replace(R, " ")
                            }),
                            s = s.slice(i.length)),
                        w.filter)
                        !(n = Y[r].exec(s)) || l[r] && !(n = l[r](n)) || (i = n.shift(),
                            o.push({
                                value: i,
                                type: r,
                                matches: n
                            }),
                            s = s.slice(i.length));
                    if (!i)
                        break
                }
                return t ? s.length : s ? re.error(e) : b(e, a).slice(0)
            },
            u = re.compile = function(e, t) {
                var i, v, m, y, b, n, o = [],
                    r = [],
                    s = C[e + " "];
                if (!s) {
                    for (t || (t = h(e)),
                        i = t.length; i--;)
                        (s = _e(t[i]))[S] ? o.push(s) : r.push(s);
                    (s = C(e, (v = r,
                        m = o,
                        y = 0 < m.length,
                        b = 0 < v.length,
                        n = function(e, t, i, n, o) {
                            var r, s, a, l = 0,
                                c = "0",
                                d = e && [],
                                u = [],
                                f = x,
                                p = e || b && w.find.TAG("*", o),
                                h = E += null == f ? 1 : Math.random() || .1,
                                g = p.length;
                            for (o && (x = t === k || t || o); c !== g && null != (r = p[c]); c++) {
                                if (b && r) {
                                    for (s = 0,
                                        t || r.ownerDocument === k || (_(r),
                                            i = !T); a = v[s++];)
                                        if (a(r, t || k, i)) {
                                            n.push(r);
                                            break
                                        }
                                    o && (E = h)
                                }
                                y && ((r = !a && r) && l--,
                                    e && d.push(r))
                            }
                            if (l += c,
                                y && c !== l) {
                                for (s = 0; a = m[s++];)
                                    a(d, u, t, i);
                                if (e) {
                                    if (0 < l)
                                        for (; c--;)
                                            d[c] || u[c] || (u[c] = D.call(n));
                                    u = we(u)
                                }
                                L.apply(n, u),
                                    o && !e && 0 < u.length && 1 < l + m.length && re.uniqueSort(n)
                            }
                            return o && (E = h,
                                    x = f),
                                d
                        },
                        y ? ae(n) : n))).selector = e
                }
                return s
            },
            g = re.select = function(e, t, i, n) {
                var o, r, s, a, l, c = "function" == typeof e && e,
                    d = !n && h(e = c.selector || e);
                if (i = i || [],
                    1 === d.length) {
                    if (2 < (r = d[0] = d[0].slice(0)).length && "ID" === (s = r[0]).type && 9 === t.nodeType && T && w.relative[r[1].type]) {
                        if (!(t = (w.find.ID(s.matches[0].replace(J, ee), t) || [])[0]))
                            return i;
                        c && (t = t.parentNode),
                            e = e.slice(r.shift().value.length)
                    }
                    for (o = Y.needsContext.test(e) ? 0 : r.length; o-- && (s = r[o], !w.relative[a = s.type]);)
                        if ((l = w.find[a]) && (n = l(s.matches[0].replace(J, ee), Z.test(r[0].type) && ge(t.parentNode) || t))) {
                            if (r.splice(o, 1), !(e = n.length && me(r)))
                                return L.apply(i, n),
                                    i;
                            break
                        }
                }
                return (c || u(e, d))(n, t, !T, i, !t || Z.test(e) && ge(t.parentNode) || t),
                    i
            },
            p.sortStable = S.split("").sort(A).join("") === S,
            p.detectDuplicates = !!c,
            _(),
            p.sortDetached = le(function(e) {
                return 1 & e.compareDocumentPosition(k.createElement("fieldset"))
            }),
            le(function(e) {
                return e.innerHTML = "<a href='#'></a>",
                    "#" === e.firstChild.getAttribute("href")
            }) || ce("type|href|height|width", function(e, t, i) {
                if (!i)
                    return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }),
            p.attributes && le(function(e) {
                return e.innerHTML = "<input/>",
                    e.firstChild.setAttribute("value", ""),
                    "" === e.firstChild.getAttribute("value")
            }) || ce("value", function(e, t, i) {
                if (!i && "input" === e.nodeName.toLowerCase())
                    return e.defaultValue
            }),
            le(function(e) {
                return null == e.getAttribute("disabled")
            }) || ce($, function(e, t, i) {
                var n;
                if (!i)
                    return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
            }),
            re
    }(k);
    S.find = p,
        S.expr = p.selectors,
        S.expr[":"] = S.expr.pseudos,
        S.uniqueSort = S.unique = p.uniqueSort,
        S.text = p.getText,
        S.isXMLDoc = p.isXML,
        S.contains = p.contains,
        S.escapeSelector = p.escape;
    var h = function(e, t, i) {
            for (var n = [], o = void 0 !== i;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (o && S(e).is(i))
                        break;
                    n.push(e)
                }
            return n
        },
        _ = function(e, t) {
            for (var i = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && i.push(e);
            return i
        },
        E = S.expr.match.needsContext;

    function C(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var A = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

    function O(e, i, n) {
        return y(i) ? S.grep(e, function(e, t) {
            return !!i.call(e, t, e) !== n
        }) : i.nodeType ? S.grep(e, function(e) {
            return e === i !== n
        }) : "string" != typeof i ? S.grep(e, function(e) {
            return -1 < o.call(i, e) !== n
        }) : S.filter(i, e, n)
    }
    S.filter = function(e, t, i) {
            var n = t[0];
            return i && (e = ":not(" + e + ")"),
                1 === t.length && 1 === n.nodeType ? S.find.matchesSelector(n, e) ? [n] : [] : S.find.matches(e, S.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
        },
        S.fn.extend({
            find: function(e) {
                var t, i, n = this.length,
                    o = this;
                if ("string" != typeof e)
                    return this.pushStack(S(e).filter(function() {
                        for (t = 0; t < n; t++)
                            if (S.contains(o[t], this))
                                return !0
                    }));
                for (i = this.pushStack([]),
                    t = 0; t < n; t++)
                    S.find(e, o[t], i);
                return 1 < n ? S.uniqueSort(i) : i
            },
            filter: function(e) {
                return this.pushStack(O(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(O(this, e || [], !0))
            },
            is: function(e) {
                return !!O(this, "string" == typeof e && E.test(e) ? S(e) : e || [], !1).length
            }
        });
    var D, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (S.fn.init = function(e, t, i) {
        var n, o;
        if (!e)
            return this;
        if (i = i || D,
            "string" != typeof e)
            return e.nodeType ? (this[0] = e,
                this.length = 1,
                this) : y(e) ? void 0 !== i.ready ? i.ready(e) : e(S) : S.makeArray(e, this);
        if (!(n = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : N.exec(e)) || !n[1] && t)
            return !t || t.jquery ? (t || i).find(e) : this.constructor(t).find(e);
        if (n[1]) {
            if (t = t instanceof S ? t[0] : t,
                S.merge(this, S.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : T, !0)),
                A.test(n[1]) && S.isPlainObject(t))
                for (n in t)
                    y(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
            return this
        }
        return (o = T.getElementById(n[2])) && (this[0] = o,
                this.length = 1),
            this
    }).prototype = S.fn,
        D = S(T);
    var L = /^(?:parents|prev(?:Until|All))/,
        I = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };

    function j(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;)
        ;
        return e
    }
    S.fn.extend({
            has: function(e) {
                var t = S(e, this),
                    i = t.length;
                return this.filter(function() {
                    for (var e = 0; e < i; e++)
                        if (S.contains(this, t[e]))
                            return !0
                })
            },
            closest: function(e, t) {
                var i, n = 0,
                    o = this.length,
                    r = [],
                    s = "string" != typeof e && S(e);
                if (!E.test(e))
                    for (; n < o; n++)
                        for (i = this[n]; i && i !== t; i = i.parentNode)
                            if (i.nodeType < 11 && (s ? -1 < s.index(i) : 1 === i.nodeType && S.find.matchesSelector(i, e))) {
                                r.push(i);
                                break
                            }
                return this.pushStack(1 < r.length ? S.uniqueSort(r) : r)
            },
            index: function(e) {
                return e ? "string" == typeof e ? o.call(S(e), this[0]) : o.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }),
        S.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return h(e, "parentNode")
            },
            parentsUntil: function(e, t, i) {
                return h(e, "parentNode", i)
            },
            next: function(e) {
                return j(e, "nextSibling")
            },
            prev: function(e) {
                return j(e, "previousSibling")
            },
            nextAll: function(e) {
                return h(e, "nextSibling")
            },
            prevAll: function(e) {
                return h(e, "previousSibling")
            },
            nextUntil: function(e, t, i) {
                return h(e, "nextSibling", i)
            },
            prevUntil: function(e, t, i) {
                return h(e, "previousSibling", i)
            },
            siblings: function(e) {
                return _((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return _(e.firstChild)
            },
            contents: function(e) {
                return C(e, "iframe") ? e.contentDocument : (C(e, "template") && (e = e.content || e),
                    S.merge([], e.childNodes))
            }
        }, function(n, o) {
            S.fn[n] = function(e, t) {
                var i = S.map(this, o, e);
                return "Until" !== n.slice(-5) && (t = e),
                    t && "string" == typeof t && (i = S.filter(t, i)),
                    1 < this.length && (I[n] || S.uniqueSort(i),
                        L.test(n) && i.reverse()),
                    this.pushStack(i)
            }
        });
    var $ = /[^\x20\t\r\n\f]+/g;

    function M(e) {
        return e
    }

    function P(e) {
        throw e
    }

    function H(e, t, i, n) {
        var o;
        try {
            e && y(o = e.promise) ? o.call(e).done(t).fail(i) : e && y(o = e.then) ? o.call(e, t, i) : t.apply(void 0, [e].slice(n))
        } catch (e) {
            i.apply(void 0, [e])
        }
    }
    S.Callbacks = function(n) {
            var e, i;
            n = "string" == typeof n ? (e = n,
                i = {},
                S.each(e.match($) || [], function(e, t) {
                    i[t] = !0
                }),
                i) : S.extend({}, n);
            var o, t, r, s, a = [],
                l = [],
                c = -1,
                d = function() {
                    for (s = s || n.once,
                        r = o = !0; l.length; c = -1)
                        for (t = l.shift(); ++c < a.length;)
                            !1 === a[c].apply(t[0], t[1]) && n.stopOnFalse && (c = a.length,
                                t = !1);
                    n.memory || (t = !1),
                        o = !1,
                        s && (a = t ? [] : "")
                },
                u = {
                    add: function() {
                        return a && (t && !o && (c = a.length - 1,
                                    l.push(t)),
                                function i(e) {
                                    S.each(e, function(e, t) {
                                        y(t) ? n.unique && u.has(t) || a.push(t) : t && t.length && "string" !== x(t) && i(t)
                                    })
                                }(arguments),
                                t && !o && d()),
                            this
                    },
                    remove: function() {
                        return S.each(arguments, function(e, t) {
                                for (var i; - 1 < (i = S.inArray(t, a, i));)
                                    a.splice(i, 1),
                                    i <= c && c--
                            }),
                            this
                    },
                    has: function(e) {
                        return e ? -1 < S.inArray(e, a) : 0 < a.length
                    },
                    empty: function() {
                        return a && (a = []),
                            this
                    },
                    disable: function() {
                        return s = l = [],
                            a = t = "",
                            this
                    },
                    disabled: function() {
                        return !a
                    },
                    lock: function() {
                        return s = l = [],
                            t || o || (a = t = ""),
                            this
                    },
                    locked: function() {
                        return !!s
                    },
                    fireWith: function(e, t) {
                        return s || (t = [e, (t = t || []).slice ? t.slice() : t],
                                l.push(t),
                                o || d()),
                            this
                    },
                    fire: function() {
                        return u.fireWith(this, arguments),
                            this
                    },
                    fired: function() {
                        return !!r
                    }
                };
            return u
        },
        S.extend({
            Deferred: function(e) {
                var r = [
                        ["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2],
                        ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"],
                        ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]
                    ],
                    o = "pending",
                    s = {
                        state: function() {
                            return o
                        },
                        always: function() {
                            return a.done(arguments).fail(arguments),
                                this
                        },
                        catch: function(e) {
                            return s.then(null, e)
                        },
                        pipe: function() {
                            var o = arguments;
                            return S.Deferred(function(n) {
                                S.each(r, function(e, t) {
                                        var i = y(o[t[4]]) && o[t[4]];
                                        a[t[1]](function() {
                                            var e = i && i.apply(this, arguments);
                                            e && y(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[t[0] + "With"](this, i ? [e] : arguments)
                                        })
                                    }),
                                    o = null
                            }).promise()
                        },
                        then: function(t, i, n) {
                            var l = 0;

                            function c(o, r, s, a) {
                                return function() {
                                    var i = this,
                                        n = arguments,
                                        e = function() {
                                            var e, t;
                                            if (!(o < l)) {
                                                if ((e = s.apply(i, n)) === r.promise())
                                                    throw new TypeError("Thenable self-resolution");
                                                t = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                                    y(t) ? a ? t.call(e, c(l, r, M, a), c(l, r, P, a)) : (l++,
                                                        t.call(e, c(l, r, M, a), c(l, r, P, a), c(l, r, M, r.notifyWith))) : (s !== M && (i = void 0,
                                                            n = [e]),
                                                        (a || r.resolveWith)(i, n))
                                            }
                                        },
                                        t = a ? e : function() {
                                            try {
                                                e()
                                            } catch (e) {
                                                S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, t.stackTrace),
                                                    l <= o + 1 && (s !== P && (i = void 0,
                                                            n = [e]),
                                                        r.rejectWith(i, n))
                                            }
                                        };
                                    o ? t() : (S.Deferred.getStackHook && (t.stackTrace = S.Deferred.getStackHook()),
                                        k.setTimeout(t))
                                }
                            }
                            return S.Deferred(function(e) {
                                r[0][3].add(c(0, e, y(n) ? n : M, e.notifyWith)),
                                    r[1][3].add(c(0, e, y(t) ? t : M)),
                                    r[2][3].add(c(0, e, y(i) ? i : P))
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? S.extend(e, s) : s
                        }
                    },
                    a = {};
                return S.each(r, function(e, t) {
                        var i = t[2],
                            n = t[5];
                        s[t[1]] = i.add,
                            n && i.add(function() {
                                o = n
                            }, r[3 - e][2].disable, r[3 - e][3].disable, r[0][2].lock, r[0][3].lock),
                            i.add(t[3].fire),
                            a[t[0]] = function() {
                                return a[t[0] + "With"](this === a ? void 0 : this, arguments),
                                    this
                            },
                            a[t[0] + "With"] = i.fireWith
                    }),
                    s.promise(a),
                    e && e.call(a, a),
                    a
            },
            when: function(e) {
                var i = arguments.length,
                    t = i,
                    n = Array(t),
                    o = a.call(arguments),
                    r = S.Deferred(),
                    s = function(t) {
                        return function(e) {
                            n[t] = this,
                                o[t] = 1 < arguments.length ? a.call(arguments) : e,
                                --i || r.resolveWith(n, o)
                        }
                    };
                if (i <= 1 && (H(e, r.done(s(t)).resolve, r.reject, !i),
                        "pending" === r.state() || y(o[t] && o[t].then)))
                    return r.then();
                for (; t--;)
                    H(o[t], s(t), r.reject);
                return r.promise()
            }
        });
    var q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    S.Deferred.exceptionHook = function(e, t) {
            k.console && k.console.warn && e && q.test(e.name) && k.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
        },
        S.readyException = function(e) {
            k.setTimeout(function() {
                throw e
            })
        };
    var W = S.Deferred();

    function R() {
        T.removeEventListener("DOMContentLoaded", R),
            k.removeEventListener("load", R),
            S.ready()
    }
    S.fn.ready = function(e) {
            return W.then(e).catch(function(e) {
                    S.readyException(e)
                }),
                this
        },
        S.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(e) {
                (!0 === e ? --S.readyWait : S.isReady) || ((S.isReady = !0) !== e && 0 < --S.readyWait || W.resolveWith(T, [S]))
            }
        }),
        S.ready.then = W.then,
        "complete" === T.readyState || "loading" !== T.readyState && !T.documentElement.doScroll ? k.setTimeout(S.ready) : (T.addEventListener("DOMContentLoaded", R),
            k.addEventListener("load", R));
    var F = function(e, t, i, n, o, r, s) {
            var a = 0,
                l = e.length,
                c = null == i;
            if ("object" === x(i))
                for (a in o = !0,
                    i)
                    F(e, t, a, i[a], !0, r, s);
            else if (void 0 !== n && (o = !0,
                    y(n) || (s = !0),
                    c && (t = s ? (t.call(e, n),
                        null) : (c = t,
                        function(e, t, i) {
                            return c.call(S(e), i)
                        }
                    )),
                    t))
                for (; a < l; a++)
                    t(e[a], i, s ? n : n.call(e[a], a, t(e[a], i)));
            return o ? e : c ? t.call(e) : l ? t(e[0], i) : r
        },
        z = /^-ms-/,
        B = /-([a-z])/g;

    function U(e, t) {
        return t.toUpperCase()
    }

    function V(e) {
        return e.replace(z, "ms-").replace(B, U)
    }
    var Y = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };

    function X() {
        this.expando = S.expando + X.uid++
    }
    X.uid = 1,
        X.prototype = {
            cache: function(e) {
                var t = e[this.expando];
                return t || (t = {},
                        Y(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                            value: t,
                            configurable: !0
                        }))),
                    t
            },
            set: function(e, t, i) {
                var n, o = this.cache(e);
                if ("string" == typeof t)
                    o[V(t)] = i;
                else
                    for (n in t)
                        o[V(n)] = t[n];
                return o
            },
            get: function(e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)]
            },
            access: function(e, t, i) {
                return void 0 === t || t && "string" == typeof t && void 0 === i ? this.get(e, t) : (this.set(e, t, i),
                    void 0 !== i ? i : t)
            },
            remove: function(e, t) {
                var i, n = e[this.expando];
                if (void 0 !== n) {
                    if (void 0 !== t) {
                        i = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in n ? [t] : t.match($) || []).length;
                        for (; i--;)
                            delete n[t[i]]
                    }
                    (void 0 === t || S.isEmptyObject(n)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                }
            },
            hasData: function(e) {
                var t = e[this.expando];
                return void 0 !== t && !S.isEmptyObject(t)
            }
        };
    var Q = new X,
        K = new X,
        G = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Z = /[A-Z]/g;

    function J(e, t, i) {
        var n, o;
        if (void 0 === i && 1 === e.nodeType)
            if (n = "data-" + t.replace(Z, "-$&").toLowerCase(),
                "string" == typeof(i = e.getAttribute(n))) {
                try {
                    i = "true" === (o = i) || "false" !== o && ("null" === o ? null : o === +o + "" ? +o : G.test(o) ? JSON.parse(o) : o)
                } catch (e) {}
                K.set(e, t, i)
            } else
                i = void 0;
        return i
    }
    S.extend({
            hasData: function(e) {
                return K.hasData(e) || Q.hasData(e)
            },
            data: function(e, t, i) {
                return K.access(e, t, i)
            },
            removeData: function(e, t) {
                K.remove(e, t)
            },
            _data: function(e, t, i) {
                return Q.access(e, t, i)
            },
            _removeData: function(e, t) {
                Q.remove(e, t)
            }
        }),
        S.fn.extend({
            data: function(i, e) {
                var t, n, o, r = this[0],
                    s = r && r.attributes;
                if (void 0 !== i)
                    return "object" == typeof i ? this.each(function() {
                        K.set(this, i)
                    }) : F(this, function(e) {
                        var t;
                        if (r && void 0 === e) {
                            if (void 0 !== (t = K.get(r, i)))
                                return t;
                            if (void 0 !== (t = J(r, i)))
                                return t
                        } else
                            this.each(function() {
                                K.set(this, i, e)
                            })
                    }, null, e, 1 < arguments.length, null, !0);
                if (this.length && (o = K.get(r),
                        1 === r.nodeType && !Q.get(r, "hasDataAttrs"))) {
                    for (t = s.length; t--;)
                        s[t] && 0 === (n = s[t].name).indexOf("data-") && (n = V(n.slice(5)),
                            J(r, n, o[n]));
                    Q.set(r, "hasDataAttrs", !0)
                }
                return o
            },
            removeData: function(e) {
                return this.each(function() {
                    K.remove(this, e)
                })
            }
        }),
        S.extend({
            queue: function(e, t, i) {
                var n;
                if (e)
                    return t = (t || "fx") + "queue",
                        n = Q.get(e, t),
                        i && (!n || Array.isArray(i) ? n = Q.access(e, t, S.makeArray(i)) : n.push(i)),
                        n || []
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var i = S.queue(e, t),
                    n = i.length,
                    o = i.shift(),
                    r = S._queueHooks(e, t);
                "inprogress" === o && (o = i.shift(),
                        n--),
                    o && ("fx" === t && i.unshift("inprogress"),
                        delete r.stop,
                        o.call(e, function() {
                            S.dequeue(e, t)
                        }, r)), !n && r && r.empty.fire()
            },
            _queueHooks: function(e, t) {
                var i = t + "queueHooks";
                return Q.get(e, i) || Q.access(e, i, {
                    empty: S.Callbacks("once memory").add(function() {
                        Q.remove(e, [t + "queue", i])
                    })
                })
            }
        }),
        S.fn.extend({
            queue: function(t, i) {
                var e = 2;
                return "string" != typeof t && (i = t,
                        t = "fx",
                        e--),
                    arguments.length < e ? S.queue(this[0], t) : void 0 === i ? this : this.each(function() {
                        var e = S.queue(this, t, i);
                        S._queueHooks(this, t),
                            "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t)
                    })
            },
            dequeue: function(e) {
                return this.each(function() {
                    S.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var i, n = 1,
                    o = S.Deferred(),
                    r = this,
                    s = this.length,
                    a = function() {
                        --n || o.resolveWith(r, [r])
                    };
                for ("string" != typeof e && (t = e,
                        e = void 0),
                    e = e || "fx"; s--;)
                    (i = Q.get(r[s], e + "queueHooks")) && i.empty && (n++,
                        i.empty.add(a));
                return a(),
                    o.promise(t)
            }
        });
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$", "i"),
        ie = ["Top", "Right", "Bottom", "Left"],
        ne = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && S.contains(e.ownerDocument, e) && "none" === S.css(e, "display")
        },
        oe = function(e, t, i, n) {
            var o, r, s = {};
            for (r in t)
                s[r] = e.style[r],
                e.style[r] = t[r];
            for (r in o = i.apply(e, n || []),
                t)
                e.style[r] = s[r];
            return o
        };

    function re(e, t, i, n) {
        var o, r, s = 20,
            a = n ? function() {
                return n.cur()
            } :
            function() {
                return S.css(e, t, "")
            },
            l = a(),
            c = i && i[3] || (S.cssNumber[t] ? "" : "px"),
            d = (S.cssNumber[t] || "px" !== c && +l) && te.exec(S.css(e, t));
        if (d && d[3] !== c) {
            for (l /= 2,
                c = c || d[3],
                d = +l || 1; s--;)
                S.style(e, t, d + c),
                (1 - r) * (1 - (r = a() / l || .5)) <= 0 && (s = 0),
                d /= r;
            d *= 2,
                S.style(e, t, d + c),
                i = i || []
        }
        return i && (d = +d || +l || 0,
                o = i[1] ? d + (i[1] + 1) * i[2] : +i[2],
                n && (n.unit = c,
                    n.start = d,
                    n.end = o)),
            o
    }
    var se = {};

    function ae(e, t) {
        for (var i, n, o = [], r = 0, s = e.length; r < s; r++)
            (n = e[r]).style && (i = n.style.display,
                t ? ("none" === i && (o[r] = Q.get(n, "display") || null,
                        o[r] || (n.style.display = "")),
                    "" === n.style.display && ne(n) && (o[r] = (u = c = l = void 0,
                        c = (a = n).ownerDocument,
                        d = a.nodeName,
                        (u = se[d]) || (l = c.body.appendChild(c.createElement(d)),
                            u = S.css(l, "display"),
                            l.parentNode.removeChild(l),
                            "none" === u && (u = "block"),
                            se[d] = u)))) : "none" !== i && (o[r] = "none",
                    Q.set(n, "display", i)));
        var a, l, c, d, u;
        for (r = 0; r < s; r++)
            null != o[r] && (e[r].style.display = o[r]);
        return e
    }
    S.fn.extend({
        show: function() {
            return ae(this, !0)
        },
        hide: function() {
            return ae(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ne(this) ? S(this).show() : S(this).hide()
            })
        }
    });
    var le = /^(?:checkbox|radio)$/i,
        ce = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
        de = /^$|^module$|\/(?:java|ecma)script/i,
        ue = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };

    function fe(e, t) {
        var i;
        return i = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
            void 0 === t || t && C(e, t) ? S.merge([e], i) : i
    }

    function pe(e, t) {
        for (var i = 0, n = e.length; i < n; i++)
            Q.set(e[i], "globalEval", !t || Q.get(t[i], "globalEval"))
    }
    ue.optgroup = ue.option,
        ue.tbody = ue.tfoot = ue.colgroup = ue.caption = ue.thead,
        ue.th = ue.td;
    var he, ge, ve = /<|&#?\w+;/;

    function me(e, t, i, n, o) {
        for (var r, s, a, l, c, d, u = t.createDocumentFragment(), f = [], p = 0, h = e.length; p < h; p++)
            if ((r = e[p]) || 0 === r)
                if ("object" === x(r))
                    S.merge(f, r.nodeType ? [r] : r);
                else if (ve.test(r)) {
            for (s = s || u.appendChild(t.createElement("div")),
                a = (ce.exec(r) || ["", ""])[1].toLowerCase(),
                l = ue[a] || ue._default,
                s.innerHTML = l[1] + S.htmlPrefilter(r) + l[2],
                d = l[0]; d--;)
                s = s.lastChild;
            S.merge(f, s.childNodes),
                (s = u.firstChild).textContent = ""
        } else
            f.push(t.createTextNode(r));
        for (u.textContent = "",
            p = 0; r = f[p++];)
            if (n && -1 < S.inArray(r, n))
                o && o.push(r);
            else if (c = S.contains(r.ownerDocument, r),
            s = fe(u.appendChild(r), "script"),
            c && pe(s),
            i)
            for (d = 0; r = s[d++];)
                de.test(r.type || "") && i.push(r);
        return u
    }
    he = T.createDocumentFragment().appendChild(T.createElement("div")),
        (ge = T.createElement("input")).setAttribute("type", "radio"),
        ge.setAttribute("checked", "checked"),
        ge.setAttribute("name", "t"),
        he.appendChild(ge),
        m.checkClone = he.cloneNode(!0).cloneNode(!0).lastChild.checked,
        he.innerHTML = "<textarea>x</textarea>",
        m.noCloneChecked = !!he.cloneNode(!0).lastChild.defaultValue;
    var ye = T.documentElement,
        be = /^key/,
        we = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        xe = /^([^.]*)(?:\.(.+)|)/;

    function _e() {
        return !0
    }

    function ke() {
        return !1
    }

    function Te() {
        try {
            return T.activeElement
        } catch (e) {}
    }

    function Se(e, t, i, n, o, r) {
        var s, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof i && (n = n || i,
                    i = void 0),
                t)
                Se(e, a, i, n, t[a], r);
            return e
        }
        if (null == n && null == o ? (o = i,
                n = i = void 0) : null == o && ("string" == typeof i ? (o = n,
                n = void 0) : (o = n,
                n = i,
                i = void 0)), !1 === o)
            o = ke;
        else if (!o)
            return e;
        return 1 === r && (s = o,
                (o = function(e) {
                    return S().off(e),
                        s.apply(this, arguments)
                }).guid = s.guid || (s.guid = S.guid++)),
            e.each(function() {
                S.event.add(this, t, o, n, i)
            })
    }
    S.event = {
            global: {},
            add: function(t, e, i, n, o) {
                var r, s, a, l, c, d, u, f, p, h, g, v = Q.get(t);
                if (v)
                    for (i.handler && (i = (r = i).handler,
                            o = r.selector),
                        o && S.find.matchesSelector(ye, o),
                        i.guid || (i.guid = S.guid++),
                        (l = v.events) || (l = v.events = {}),
                        (s = v.handle) || (s = v.handle = function(e) {
                            return void 0 !== S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0
                        }),
                        c = (e = (e || "").match($) || [""]).length; c--;)
                        p = g = (a = xe.exec(e[c]) || [])[1],
                        h = (a[2] || "").split(".").sort(),
                        p && (u = S.event.special[p] || {},
                            p = (o ? u.delegateType : u.bindType) || p,
                            u = S.event.special[p] || {},
                            d = S.extend({
                                type: p,
                                origType: g,
                                data: n,
                                handler: i,
                                guid: i.guid,
                                selector: o,
                                needsContext: o && S.expr.match.needsContext.test(o),
                                namespace: h.join(".")
                            }, r),
                            (f = l[p]) || ((f = l[p] = []).delegateCount = 0,
                                u.setup && !1 !== u.setup.call(t, n, h, s) || t.addEventListener && t.addEventListener(p, s)),
                            u.add && (u.add.call(t, d),
                                d.handler.guid || (d.handler.guid = i.guid)),
                            o ? f.splice(f.delegateCount++, 0, d) : f.push(d),
                            S.event.global[p] = !0)
            },
            remove: function(e, t, i, n, o) {
                var r, s, a, l, c, d, u, f, p, h, g, v = Q.hasData(e) && Q.get(e);
                if (v && (l = v.events)) {
                    for (c = (t = (t || "").match($) || [""]).length; c--;)
                        if (p = g = (a = xe.exec(t[c]) || [])[1],
                            h = (a[2] || "").split(".").sort(),
                            p) {
                            for (u = S.event.special[p] || {},
                                f = l[p = (n ? u.delegateType : u.bindType) || p] || [],
                                a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                                s = r = f.length; r--;)
                                d = f[r], !o && g !== d.origType || i && i.guid !== d.guid || a && !a.test(d.namespace) || n && n !== d.selector && ("**" !== n || !d.selector) || (f.splice(r, 1),
                                    d.selector && f.delegateCount--,
                                    u.remove && u.remove.call(e, d));
                            s && !f.length && (u.teardown && !1 !== u.teardown.call(e, h, v.handle) || S.removeEvent(e, p, v.handle),
                                delete l[p])
                        } else
                            for (p in l)
                                S.event.remove(e, p + t[c], i, n, !0);
                    S.isEmptyObject(l) && Q.remove(e, "handle events")
                }
            },
            dispatch: function(e) {
                var t, i, n, o, r, s, a = S.event.fix(e),
                    l = new Array(arguments.length),
                    c = (Q.get(this, "events") || {})[a.type] || [],
                    d = S.event.special[a.type] || {};
                for (l[0] = a,
                    t = 1; t < arguments.length; t++)
                    l[t] = arguments[t];
                if (a.delegateTarget = this, !d.preDispatch || !1 !== d.preDispatch.call(this, a)) {
                    for (s = S.event.handlers.call(this, a, c),
                        t = 0;
                        (o = s[t++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = o.elem,
                            i = 0;
                            (r = o.handlers[i++]) && !a.isImmediatePropagationStopped();)
                            a.rnamespace && !a.rnamespace.test(r.namespace) || (a.handleObj = r,
                                a.data = r.data,
                                void 0 !== (n = ((S.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) && !1 === (a.result = n) && (a.preventDefault(),
                                    a.stopPropagation()));
                    return d.postDispatch && d.postDispatch.call(this, a),
                        a.result
                }
            },
            handlers: function(e, t) {
                var i, n, o, r, s, a = [],
                    l = t.delegateCount,
                    c = e.target;
                if (l && c.nodeType && !("click" === e.type && 1 <= e.button))
                    for (; c !== this; c = c.parentNode || this)
                        if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                            for (r = [],
                                s = {},
                                i = 0; i < l; i++)
                                void 0 === s[o = (n = t[i]).selector + " "] && (s[o] = n.needsContext ? -1 < S(o, this).index(c) : S.find(o, this, null, [c]).length),
                                s[o] && r.push(n);
                            r.length && a.push({
                                elem: c,
                                handlers: r
                            })
                        }
                return c = this,
                    l < t.length && a.push({
                        elem: c,
                        handlers: t.slice(l)
                    }),
                    a
            },
            addProp: function(t, e) {
                Object.defineProperty(S.Event.prototype, t, {
                    enumerable: !0,
                    configurable: !0,
                    get: y(e) ? function() {
                        if (this.originalEvent)
                            return e(this.originalEvent)
                    } : function() {
                        if (this.originalEvent)
                            return this.originalEvent[t]
                    },
                    set: function(e) {
                        Object.defineProperty(this, t, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: e
                        })
                    }
                })
            },
            fix: function(e) {
                return e[S.expando] ? e : new S.Event(e)
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== Te() && this.focus)
                            return this.focus(), !1
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === Te() && this.blur)
                            return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if ("checkbox" === this.type && this.click && C(this, "input"))
                            return this.click(), !1
                    },
                    _default: function(e) {
                        return C(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            }
        },
        S.removeEvent = function(e, t, i) {
            e.removeEventListener && e.removeEventListener(t, i)
        },
        S.Event = function(e, t) {
            if (!(this instanceof S.Event))
                return new S.Event(e, t);
            e && e.type ? (this.originalEvent = e,
                    this.type = e.type,
                    this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? _e : ke,
                    this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
                    this.currentTarget = e.currentTarget,
                    this.relatedTarget = e.relatedTarget) : this.type = e,
                t && S.extend(this, t),
                this.timeStamp = e && e.timeStamp || Date.now(),
                this[S.expando] = !0
        },
        S.Event.prototype = {
            constructor: S.Event,
            isDefaultPrevented: ke,
            isPropagationStopped: ke,
            isImmediatePropagationStopped: ke,
            isSimulated: !1,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = _e,
                    e && !this.isSimulated && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = _e,
                    e && !this.isSimulated && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = _e,
                    e && !this.isSimulated && e.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        S.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(e) {
                var t = e.button;
                return null == e.which && be.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && we.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
            }
        }, S.event.addProp),
        S.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, o) {
            S.event.special[e] = {
                delegateType: o,
                bindType: o,
                handle: function(e) {
                    var t, i = e.relatedTarget,
                        n = e.handleObj;
                    return i && (i === this || S.contains(this, i)) || (e.type = n.origType,
                            t = n.handler.apply(this, arguments),
                            e.type = o),
                        t
                }
            }
        }),
        S.fn.extend({
            on: function(e, t, i, n) {
                return Se(this, e, t, i, n)
            },
            one: function(e, t, i, n) {
                return Se(this, e, t, i, n, 1)
            },
            off: function(e, t, i) {
                var n, o;
                if (e && e.preventDefault && e.handleObj)
                    return n = e.handleObj,
                        S(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler),
                        this;
                if ("object" != typeof e)
                    return !1 !== t && "function" != typeof t || (i = t,
                            t = void 0), !1 === i && (i = ke),
                        this.each(function() {
                            S.event.remove(this, e, i, t)
                        });
                for (o in e)
                    this.off(o, t, e[o]);
                return this
            }
        });
    var Ee = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        Ce = /<script|<style|<link/i,
        Ae = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Oe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function De(e, t) {
        return C(e, "table") && C(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e
    }

    function Ne(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
            e
    }

    function Le(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
            e
    }

    function Ie(e, t) {
        var i, n, o, r, s, a, l, c;
        if (1 === t.nodeType) {
            if (Q.hasData(e) && (r = Q.access(e),
                    s = Q.set(t, r),
                    c = r.events))
                for (o in delete s.handle,
                    s.events = {},
                    c)
                    for (i = 0,
                        n = c[o].length; i < n; i++)
                        S.event.add(t, o, c[o][i]);
            K.hasData(e) && (a = K.access(e),
                l = S.extend({}, a),
                K.set(t, l))
        }
    }

    function je(i, n, o, r) {
        n = g.apply([], n);
        var e, t, s, a, l, c, d = 0,
            u = i.length,
            f = u - 1,
            p = n[0],
            h = y(p);
        if (h || 1 < u && "string" == typeof p && !m.checkClone && Ae.test(p))
            return i.each(function(e) {
                var t = i.eq(e);
                h && (n[0] = p.call(this, e, t.html())),
                    je(t, n, o, r)
            });
        if (u && (t = (e = me(n, i[0].ownerDocument, !1, i, r)).firstChild,
                1 === e.childNodes.length && (e = t),
                t || r)) {
            for (a = (s = S.map(fe(e, "script"), Ne)).length; d < u; d++)
                l = e,
                d !== f && (l = S.clone(l, !0, !0),
                    a && S.merge(s, fe(l, "script"))),
                o.call(i[d], l, d);
            if (a)
                for (c = s[s.length - 1].ownerDocument,
                    S.map(s, Le),
                    d = 0; d < a; d++)
                    l = s[d],
                    de.test(l.type || "") && !Q.access(l, "globalEval") && S.contains(c, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? S._evalUrl && S._evalUrl(l.src) : w(l.textContent.replace(Oe, ""), c, l))
        }
        return i
    }

    function $e(e, t, i) {
        for (var n, o = t ? S.filter(t, e) : e, r = 0; null != (n = o[r]); r++)
            i || 1 !== n.nodeType || S.cleanData(fe(n)),
            n.parentNode && (i && S.contains(n.ownerDocument, n) && pe(fe(n, "script")),
                n.parentNode.removeChild(n));
        return e
    }
    S.extend({
            htmlPrefilter: function(e) {
                return e.replace(Ee, "<$1></$2>")
            },
            clone: function(e, t, i) {
                var n, o, r, s, a, l, c, d = e.cloneNode(!0),
                    u = S.contains(e.ownerDocument, e);
                if (!(m.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e)))
                    for (s = fe(d),
                        n = 0,
                        o = (r = fe(e)).length; n < o; n++)
                        a = r[n],
                        l = s[n],
                        void 0,
                        "input" === (c = l.nodeName.toLowerCase()) && le.test(a.type) ? l.checked = a.checked : "input" !== c && "textarea" !== c || (l.defaultValue = a.defaultValue);
                if (t)
                    if (i)
                        for (r = r || fe(e),
                            s = s || fe(d),
                            n = 0,
                            o = r.length; n < o; n++)
                            Ie(r[n], s[n]);
                    else
                        Ie(e, d);
                return 0 < (s = fe(d, "script")).length && pe(s, !u && fe(e, "script")),
                    d
            },
            cleanData: function(e) {
                for (var t, i, n, o = S.event.special, r = 0; void 0 !== (i = e[r]); r++)
                    if (Y(i)) {
                        if (t = i[Q.expando]) {
                            if (t.events)
                                for (n in t.events)
                                    o[n] ? S.event.remove(i, n) : S.removeEvent(i, n, t.handle);
                            i[Q.expando] = void 0
                        }
                        i[K.expando] && (i[K.expando] = void 0)
                    }
            }
        }),
        S.fn.extend({
            detach: function(e) {
                return $e(this, e, !0)
            },
            remove: function(e) {
                return $e(this, e)
            },
            text: function(e) {
                return F(this, function(e) {
                    return void 0 === e ? S.text(this) : this.empty().each(function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return je(this, arguments, function(e) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || De(this, e).appendChild(e)
                })
            },
            prepend: function() {
                return je(this, arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = De(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return je(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return je(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++)
                    1 === e.nodeType && (S.cleanData(fe(e, !1)),
                        e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = null != e && e,
                    t = null == t ? e : t,
                    this.map(function() {
                        return S.clone(this, e, t)
                    })
            },
            html: function(e) {
                return F(this, function(e) {
                    var t = this[0] || {},
                        i = 0,
                        n = this.length;
                    if (void 0 === e && 1 === t.nodeType)
                        return t.innerHTML;
                    if ("string" == typeof e && !Ce.test(e) && !ue[(ce.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = S.htmlPrefilter(e);
                        try {
                            for (; i < n; i++)
                                1 === (t = this[i] || {}).nodeType && (S.cleanData(fe(t, !1)),
                                    t.innerHTML = e);
                            t = 0
                        } catch (e) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var i = [];
                return je(this, arguments, function(e) {
                    var t = this.parentNode;
                    S.inArray(this, i) < 0 && (S.cleanData(fe(this)),
                        t && t.replaceChild(e, this))
                }, i)
            }
        }),
        S.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, s) {
            S.fn[e] = function(e) {
                for (var t, i = [], n = S(e), o = n.length - 1, r = 0; r <= o; r++)
                    t = r === o ? this : this.clone(!0),
                    S(n[r])[s](t),
                    l.apply(i, t.get());
                return this.pushStack(i)
            }
        });
    var Me = new RegExp("^(" + ee + ")(?!px)[a-z%]+$", "i"),
        Pe = function(e) {
            var t = e.ownerDocument.defaultView;
            return t && t.opener || (t = k),
                t.getComputedStyle(e)
        },
        He = new RegExp(ie.join("|"), "i");

    function qe(e, t, i) {
        var n, o, r, s, a = e.style;
        return (i = i || Pe(e)) && ("" !== (s = i.getPropertyValue(t) || i[t]) || S.contains(e.ownerDocument, e) || (s = S.style(e, t)), !m.pixelBoxStyles() && Me.test(s) && He.test(t) && (n = a.width,
                o = a.minWidth,
                r = a.maxWidth,
                a.minWidth = a.maxWidth = a.width = s,
                s = i.width,
                a.width = n,
                a.minWidth = o,
                a.maxWidth = r)),
            void 0 !== s ? s + "" : s
    }

    function We(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }! function() {
        function e() {
            if (l) {
                a.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                    l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                    ye.appendChild(a).appendChild(l);
                var e = k.getComputedStyle(l);
                i = "1%" !== e.top,
                    s = 12 === t(e.marginLeft),
                    l.style.right = "60%",
                    r = 36 === t(e.right),
                    n = 36 === t(e.width),
                    l.style.position = "absolute",
                    o = 36 === l.offsetWidth || "absolute",
                    ye.removeChild(a),
                    l = null
            }
        }

        function t(e) {
            return Math.round(parseFloat(e))
        }
        var i, n, o, r, s, a = T.createElement("div"),
            l = T.createElement("div");
        l.style && (l.style.backgroundClip = "content-box",
            l.cloneNode(!0).style.backgroundClip = "",
            m.clearCloneStyle = "content-box" === l.style.backgroundClip,
            S.extend(m, {
                boxSizingReliable: function() {
                    return e(),
                        n
                },
                pixelBoxStyles: function() {
                    return e(),
                        r
                },
                pixelPosition: function() {
                    return e(),
                        i
                },
                reliableMarginLeft: function() {
                    return e(),
                        s
                },
                scrollboxSize: function() {
                    return e(),
                        o
                }
            }))
    }();
    var Re = /^(none|table(?!-c[ea]).+)/,
        Fe = /^--/,
        ze = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Be = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Ue = ["Webkit", "Moz", "ms"],
        Ve = T.createElement("div").style;

    function Ye(e) {
        var t = S.cssProps[e];
        return t || (t = S.cssProps[e] = function(e) {
                if (e in Ve)
                    return e;
                for (var t = e[0].toUpperCase() + e.slice(1), i = Ue.length; i--;)
                    if ((e = Ue[i] + t) in Ve)
                        return e
            }(e) || e),
            t
    }

    function Xe(e, t, i) {
        var n = te.exec(t);
        return n ? Math.max(0, n[2] - (i || 0)) + (n[3] || "px") : t
    }

    function Qe(e, t, i, n, o, r) {
        var s = "width" === t ? 1 : 0,
            a = 0,
            l = 0;
        if (i === (n ? "border" : "content"))
            return 0;
        for (; s < 4; s += 2)
            "margin" === i && (l += S.css(e, i + ie[s], !0, o)),
            n ? ("content" === i && (l -= S.css(e, "padding" + ie[s], !0, o)),
                "margin" !== i && (l -= S.css(e, "border" + ie[s] + "Width", !0, o))) : (l += S.css(e, "padding" + ie[s], !0, o),
                "padding" !== i ? l += S.css(e, "border" + ie[s] + "Width", !0, o) : a += S.css(e, "border" + ie[s] + "Width", !0, o));
        return !n && 0 <= r && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - r - l - a - .5))),
            l
    }

    function Ke(e, t, i) {
        var n = Pe(e),
            o = qe(e, t, n),
            r = "border-box" === S.css(e, "boxSizing", !1, n),
            s = r;
        if (Me.test(o)) {
            if (!i)
                return o;
            o = "auto"
        }
        return s = s && (m.boxSizingReliable() || o === e.style[t]),
            ("auto" === o || !parseFloat(o) && "inline" === S.css(e, "display", !1, n)) && (o = e["offset" + t[0].toUpperCase() + t.slice(1)],
                s = !0),
            (o = parseFloat(o) || 0) + Qe(e, t, i || (r ? "border" : "content"), s, n, o) + "px"
    }

    function Ge(e, t, i, n, o) {
        return new Ge.prototype.init(e, t, i, n, o)
    }
    S.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var i = qe(e, "opacity");
                            return "" === i ? "1" : i
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {},
            style: function(e, t, i, n) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o, r, s, a = V(t),
                        l = Fe.test(t),
                        c = e.style;
                    if (l || (t = Ye(a)),
                        s = S.cssHooks[t] || S.cssHooks[a],
                        void 0 === i)
                        return s && "get" in s && void 0 !== (o = s.get(e, !1, n)) ? o : c[t];
                    "string" == (r = typeof i) && (o = te.exec(i)) && o[1] && (i = re(e, t, o),
                            r = "number"),
                        null != i && i == i && ("number" === r && (i += o && o[3] || (S.cssNumber[a] ? "" : "px")),
                            m.clearCloneStyle || "" !== i || 0 !== t.indexOf("background") || (c[t] = "inherit"),
                            s && "set" in s && void 0 === (i = s.set(e, i, n)) || (l ? c.setProperty(t, i) : c[t] = i))
                }
            },
            css: function(e, t, i, n) {
                var o, r, s, a = V(t);
                return Fe.test(t) || (t = Ye(a)),
                    (s = S.cssHooks[t] || S.cssHooks[a]) && "get" in s && (o = s.get(e, !0, i)),
                    void 0 === o && (o = qe(e, t, n)),
                    "normal" === o && t in Be && (o = Be[t]),
                    "" === i || i ? (r = parseFloat(o), !0 === i || isFinite(r) ? r || 0 : o) : o
            }
        }),
        S.each(["height", "width"], function(e, a) {
            S.cssHooks[a] = {
                get: function(e, t, i) {
                    if (t)
                        return !Re.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? Ke(e, a, i) : oe(e, ze, function() {
                            return Ke(e, a, i)
                        })
                },
                set: function(e, t, i) {
                    var n, o = Pe(e),
                        r = "border-box" === S.css(e, "boxSizing", !1, o),
                        s = i && Qe(e, a, i, r, o);
                    return r && m.scrollboxSize() === o.position && (s -= Math.ceil(e["offset" + a[0].toUpperCase() + a.slice(1)] - parseFloat(o[a]) - Qe(e, a, "border", !1, o) - .5)),
                        s && (n = te.exec(t)) && "px" !== (n[3] || "px") && (e.style[a] = t,
                            t = S.css(e, a)),
                        Xe(0, t, s)
                }
            }
        }),
        S.cssHooks.marginLeft = We(m.reliableMarginLeft, function(e, t) {
            if (t)
                return (parseFloat(qe(e, "marginLeft")) || e.getBoundingClientRect().left - oe(e, {
                    marginLeft: 0
                }, function() {
                    return e.getBoundingClientRect().left
                })) + "px"
        }),
        S.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(o, r) {
            S.cssHooks[o + r] = {
                    expand: function(e) {
                        for (var t = 0, i = {}, n = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                            i[o + ie[t] + r] = n[t] || n[t - 2] || n[0];
                        return i
                    }
                },
                "margin" !== o && (S.cssHooks[o + r].set = Xe)
        }),
        S.fn.extend({
            css: function(e, t) {
                return F(this, function(e, t, i) {
                    var n, o, r = {},
                        s = 0;
                    if (Array.isArray(t)) {
                        for (n = Pe(e),
                            o = t.length; s < o; s++)
                            r[t[s]] = S.css(e, t[s], !1, n);
                        return r
                    }
                    return void 0 !== i ? S.style(e, t, i) : S.css(e, t)
                }, e, t, 1 < arguments.length)
            }
        }),
        ((S.Tween = Ge).prototype = {
            constructor: Ge,
            init: function(e, t, i, n, o, r) {
                this.elem = e,
                    this.prop = i,
                    this.easing = o || S.easing._default,
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = n,
                    this.unit = r || (S.cssNumber[i] ? "" : "px")
            },
            cur: function() {
                var e = Ge.propHooks[this.prop];
                return e && e.get ? e.get(this) : Ge.propHooks._default.get(this)
            },
            run: function(e) {
                var t, i = Ge.propHooks[this.prop];
                return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
                    this.now = (this.end - this.start) * t + this.start,
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                    i && i.set ? i.set(this) : Ge.propHooks._default.set(this),
                    this
            }
        }).init.prototype = Ge.prototype,
        (Ge.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
                },
                set: function(e) {
                    S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[S.cssProps[e.prop]] && !S.cssHooks[e.prop] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit)
                }
            }
        }).scrollTop = Ge.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        },
        S.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            },
            _default: "swing"
        },
        S.fx = Ge.prototype.init,
        S.fx.step = {};
    var Ze, Je, et, tt, it = /^(?:toggle|show|hide)$/,
        nt = /queueHooks$/;

    function ot() {
        Je && (!1 === T.hidden && k.requestAnimationFrame ? k.requestAnimationFrame(ot) : k.setTimeout(ot, S.fx.interval),
            S.fx.tick())
    }

    function rt() {
        return k.setTimeout(function() {
                Ze = void 0
            }),
            Ze = Date.now()
    }

    function st(e, t) {
        var i, n = 0,
            o = {
                height: e
            };
        for (t = t ? 1 : 0; n < 4; n += 2 - t)
            o["margin" + (i = ie[n])] = o["padding" + i] = e;
        return t && (o.opacity = o.width = e),
            o
    }

    function at(e, t, i) {
        for (var n, o = (lt.tweeners[t] || []).concat(lt.tweeners["*"]), r = 0, s = o.length; r < s; r++)
            if (n = o[r].call(i, t, e))
                return n
    }

    function lt(r, e, t) {
        var i, s, n = 0,
            o = lt.prefilters.length,
            a = S.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (s)
                    return !1;
                for (var e = Ze || rt(), t = Math.max(0, c.startTime + c.duration - e), i = 1 - (t / c.duration || 0), n = 0, o = c.tweens.length; n < o; n++)
                    c.tweens[n].run(i);
                return a.notifyWith(r, [c, i, t]),
                    i < 1 && o ? t : (o || a.notifyWith(r, [c, 1, 0]),
                        a.resolveWith(r, [c]), !1)
            },
            c = a.promise({
                elem: r,
                props: S.extend({}, e),
                opts: S.extend(!0, {
                    specialEasing: {},
                    easing: S.easing._default
                }, t),
                originalProperties: e,
                originalOptions: t,
                startTime: Ze || rt(),
                duration: t.duration,
                tweens: [],
                createTween: function(e, t) {
                    var i = S.Tween(r, c.opts, e, t, c.opts.specialEasing[e] || c.opts.easing);
                    return c.tweens.push(i),
                        i
                },
                stop: function(e) {
                    var t = 0,
                        i = e ? c.tweens.length : 0;
                    if (s)
                        return this;
                    for (s = !0; t < i; t++)
                        c.tweens[t].run(1);
                    return e ? (a.notifyWith(r, [c, 1, 0]),
                            a.resolveWith(r, [c, e])) : a.rejectWith(r, [c, e]),
                        this
                }
            }),
            d = c.props;
        for (function(e, t) {
                var i, n, o, r, s;
                for (i in e)
                    if (o = t[n = V(i)],
                        r = e[i],
                        Array.isArray(r) && (o = r[1],
                            r = e[i] = r[0]),
                        i !== n && (e[n] = r,
                            delete e[i]),
                        (s = S.cssHooks[n]) && "expand" in s)
                        for (i in r = s.expand(r),
                            delete e[n],
                            r)
                            i in e || (e[i] = r[i],
                                t[i] = o);
                    else
                        t[n] = o
            }(d, c.opts.specialEasing); n < o; n++)
            if (i = lt.prefilters[n].call(c, r, d, c.opts))
                return y(i.stop) && (S._queueHooks(c.elem, c.opts.queue).stop = i.stop.bind(i)),
                    i;
        return S.map(d, at, c),
            y(c.opts.start) && c.opts.start.call(r, c),
            c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always),
            S.fx.timer(S.extend(l, {
                elem: r,
                anim: c,
                queue: c.opts.queue
            })),
            c
    }
    S.Animation = S.extend(lt, {
            tweeners: {
                "*": [function(e, t) {
                    var i = this.createTween(e, t);
                    return re(i.elem, e, te.exec(t), i),
                        i
                }]
            },
            tweener: function(e, t) {
                for (var i, n = 0, o = (e = y(e) ? (t = e, ["*"]) : e.match($)).length; n < o; n++)
                    i = e[n],
                    lt.tweeners[i] = lt.tweeners[i] || [],
                    lt.tweeners[i].unshift(t)
            },
            prefilters: [function(e, t, i) {
                var n, o, r, s, a, l, c, d, u = "width" in t || "height" in t,
                    f = this,
                    p = {},
                    h = e.style,
                    g = e.nodeType && ne(e),
                    v = Q.get(e, "fxshow");
                for (n in i.queue || (null == (s = S._queueHooks(e, "fx")).unqueued && (s.unqueued = 0,
                            a = s.empty.fire,
                            s.empty.fire = function() {
                                s.unqueued || a()
                            }
                        ),
                        s.unqueued++,
                        f.always(function() {
                            f.always(function() {
                                s.unqueued--,
                                    S.queue(e, "fx").length || s.empty.fire()
                            })
                        })),
                    t)
                    if (o = t[n],
                        it.test(o)) {
                        if (delete t[n],
                            r = r || "toggle" === o,
                            o === (g ? "hide" : "show")) {
                            if ("show" !== o || !v || void 0 === v[n])
                                continue;
                            g = !0
                        }
                        p[n] = v && v[n] || S.style(e, n)
                    }
                if ((l = !S.isEmptyObject(t)) || !S.isEmptyObject(p))
                    for (n in u && 1 === e.nodeType && (i.overflow = [h.overflow, h.overflowX, h.overflowY],
                            null == (c = v && v.display) && (c = Q.get(e, "display")),
                            "none" === (d = S.css(e, "display")) && (c ? d = c : (ae([e], !0),
                                c = e.style.display || c,
                                d = S.css(e, "display"),
                                ae([e]))),
                            ("inline" === d || "inline-block" === d && null != c) && "none" === S.css(e, "float") && (l || (f.done(function() {
                                        h.display = c
                                    }),
                                    null == c && (d = h.display,
                                        c = "none" === d ? "" : d)),
                                h.display = "inline-block")),
                        i.overflow && (h.overflow = "hidden",
                            f.always(function() {
                                h.overflow = i.overflow[0],
                                    h.overflowX = i.overflow[1],
                                    h.overflowY = i.overflow[2]
                            })),
                        l = !1,
                        p)
                        l || (v ? "hidden" in v && (g = v.hidden) : v = Q.access(e, "fxshow", {
                                display: c
                            }),
                            r && (v.hidden = !g),
                            g && ae([e], !0),
                            f.done(function() {
                                for (n in g || ae([e]),
                                    Q.remove(e, "fxshow"),
                                    p)
                                    S.style(e, n, p[n])
                            })),
                        l = at(g ? v[n] : 0, n, f),
                        n in v || (v[n] = l.start,
                            g && (l.end = l.start,
                                l.start = 0))
            }],
            prefilter: function(e, t) {
                t ? lt.prefilters.unshift(e) : lt.prefilters.push(e)
            }
        }),
        S.speed = function(e, t, i) {
            var n = e && "object" == typeof e ? S.extend({}, e) : {
                complete: i || !i && t || y(e) && e,
                duration: e,
                easing: i && t || t && !y(t) && t
            };
            return S.fx.off ? n.duration = 0 : "number" != typeof n.duration && (n.duration in S.fx.speeds ? n.duration = S.fx.speeds[n.duration] : n.duration = S.fx.speeds._default),
                null != n.queue && !0 !== n.queue || (n.queue = "fx"),
                n.old = n.complete,
                n.complete = function() {
                    y(n.old) && n.old.call(this),
                        n.queue && S.dequeue(this, n.queue)
                },
                n
        },
        S.fn.extend({
            fadeTo: function(e, t, i, n) {
                return this.filter(ne).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, i, n)
            },
            animate: function(t, e, i, n) {
                var o = S.isEmptyObject(t),
                    r = S.speed(e, i, n),
                    s = function() {
                        var e = lt(this, S.extend({}, t), r);
                        (o || Q.get(this, "finish")) && e.stop(!0)
                    };
                return s.finish = s,
                    o || !1 === r.queue ? this.each(s) : this.queue(r.queue, s)
            },
            stop: function(o, e, r) {
                var s = function(e) {
                    var t = e.stop;
                    delete e.stop,
                        t(r)
                };
                return "string" != typeof o && (r = e,
                        e = o,
                        o = void 0),
                    e && !1 !== o && this.queue(o || "fx", []),
                    this.each(function() {
                        var e = !0,
                            t = null != o && o + "queueHooks",
                            i = S.timers,
                            n = Q.get(this);
                        if (t)
                            n[t] && n[t].stop && s(n[t]);
                        else
                            for (t in n)
                                n[t] && n[t].stop && nt.test(t) && s(n[t]);
                        for (t = i.length; t--;)
                            i[t].elem !== this || null != o && i[t].queue !== o || (i[t].anim.stop(r),
                                e = !1,
                                i.splice(t, 1));
                        !e && r || S.dequeue(this, o)
                    })
            },
            finish: function(s) {
                return !1 !== s && (s = s || "fx"),
                    this.each(function() {
                        var e, t = Q.get(this),
                            i = t[s + "queue"],
                            n = t[s + "queueHooks"],
                            o = S.timers,
                            r = i ? i.length : 0;
                        for (t.finish = !0,
                            S.queue(this, s, []),
                            n && n.stop && n.stop.call(this, !0),
                            e = o.length; e--;)
                            o[e].elem === this && o[e].queue === s && (o[e].anim.stop(!0),
                                o.splice(e, 1));
                        for (e = 0; e < r; e++)
                            i[e] && i[e].finish && i[e].finish.call(this);
                        delete t.finish
                    })
            }
        }),
        S.each(["toggle", "show", "hide"], function(e, n) {
            var o = S.fn[n];
            S.fn[n] = function(e, t, i) {
                return null == e || "boolean" == typeof e ? o.apply(this, arguments) : this.animate(st(n, !0), e, t, i)
            }
        }),
        S.each({
            slideDown: st("show"),
            slideUp: st("hide"),
            slideToggle: st("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, n) {
            S.fn[e] = function(e, t, i) {
                return this.animate(n, e, t, i)
            }
        }),
        S.timers = [],
        S.fx.tick = function() {
            var e, t = 0,
                i = S.timers;
            for (Ze = Date.now(); t < i.length; t++)
                (e = i[t])() || i[t] !== e || i.splice(t--, 1);
            i.length || S.fx.stop(),
                Ze = void 0
        },
        S.fx.timer = function(e) {
            S.timers.push(e),
                S.fx.start()
        },
        S.fx.interval = 13,
        S.fx.start = function() {
            Je || (Je = !0,
                ot())
        },
        S.fx.stop = function() {
            Je = null
        },
        S.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        S.fn.delay = function(n, e) {
            return n = S.fx && S.fx.speeds[n] || n,
                e = e || "fx",
                this.queue(e, function(e, t) {
                    var i = k.setTimeout(e, n);
                    t.stop = function() {
                        k.clearTimeout(i)
                    }
                })
        },
        et = T.createElement("input"),
        tt = T.createElement("select").appendChild(T.createElement("option")),
        et.type = "checkbox",
        m.checkOn = "" !== et.value,
        m.optSelected = tt.selected,
        (et = T.createElement("input")).value = "t",
        et.type = "radio",
        m.radioValue = "t" === et.value;
    var ct, dt = S.expr.attrHandle;
    S.fn.extend({
            attr: function(e, t) {
                return F(this, S.attr, e, t, 1 < arguments.length)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    S.removeAttr(this, e)
                })
            }
        }),
        S.extend({
            attr: function(e, t, i) {
                var n, o, r = e.nodeType;
                if (3 !== r && 8 !== r && 2 !== r)
                    return void 0 === e.getAttribute ? S.prop(e, t, i) : (1 === r && S.isXMLDoc(e) || (o = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? ct : void 0)),
                        void 0 !== i ? null === i ? void S.removeAttr(e, t) : o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : (e.setAttribute(t, i + ""),
                            i) : o && "get" in o && null !== (n = o.get(e, t)) ? n : null == (n = S.find.attr(e, t)) ? void 0 : n)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!m.radioValue && "radio" === t && C(e, "input")) {
                            var i = e.value;
                            return e.setAttribute("type", t),
                                i && (e.value = i),
                                t
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var i, n = 0,
                    o = t && t.match($);
                if (o && 1 === e.nodeType)
                    for (; i = o[n++];)
                        e.removeAttribute(i)
            }
        }),
        ct = {
            set: function(e, t, i) {
                return !1 === t ? S.removeAttr(e, i) : e.setAttribute(i, i),
                    i
            }
        },
        S.each(S.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var s = dt[t] || S.find.attr;
            dt[t] = function(e, t, i) {
                var n, o, r = t.toLowerCase();
                return i || (o = dt[r],
                        dt[r] = n,
                        n = null != s(e, t, i) ? r : null,
                        dt[r] = o),
                    n
            }
        });
    var ut = /^(?:input|select|textarea|button)$/i,
        ft = /^(?:a|area)$/i;

    function pt(e) {
        return (e.match($) || []).join(" ")
    }

    function ht(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function gt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match($) || []
    }
    S.fn.extend({
            prop: function(e, t) {
                return F(this, S.prop, e, t, 1 < arguments.length)
            },
            removeProp: function(e) {
                return this.each(function() {
                    delete this[S.propFix[e] || e]
                })
            }
        }),
        S.extend({
            prop: function(e, t, i) {
                var n, o, r = e.nodeType;
                if (3 !== r && 8 !== r && 2 !== r)
                    return 1 === r && S.isXMLDoc(e) || (t = S.propFix[t] || t,
                            o = S.propHooks[t]),
                        void 0 !== i ? o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : e[t] = i : o && "get" in o && null !== (n = o.get(e, t)) ? n : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = S.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : ut.test(e.nodeName) || ft.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }),
        m.optSelected || (S.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex,
                    null
            },
            set: function(e) {
                var t = e.parentNode;
                t && (t.selectedIndex,
                    t.parentNode && t.parentNode.selectedIndex)
            }
        }),
        S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            S.propFix[this.toLowerCase()] = this
        }),
        S.fn.extend({
            addClass: function(t) {
                var e, i, n, o, r, s, a, l = 0;
                if (y(t))
                    return this.each(function(e) {
                        S(this).addClass(t.call(this, e, ht(this)))
                    });
                if ((e = gt(t)).length)
                    for (; i = this[l++];)
                        if (o = ht(i),
                            n = 1 === i.nodeType && " " + pt(o) + " ") {
                            for (s = 0; r = e[s++];)
                                n.indexOf(" " + r + " ") < 0 && (n += r + " ");
                            o !== (a = pt(n)) && i.setAttribute("class", a)
                        }
                return this
            },
            removeClass: function(t) {
                var e, i, n, o, r, s, a, l = 0;
                if (y(t))
                    return this.each(function(e) {
                        S(this).removeClass(t.call(this, e, ht(this)))
                    });
                if (!arguments.length)
                    return this.attr("class", "");
                if ((e = gt(t)).length)
                    for (; i = this[l++];)
                        if (o = ht(i),
                            n = 1 === i.nodeType && " " + pt(o) + " ") {
                            for (s = 0; r = e[s++];)
                                for (; - 1 < n.indexOf(" " + r + " ");)
                                    n = n.replace(" " + r + " ", " ");
                            o !== (a = pt(n)) && i.setAttribute("class", a)
                        }
                return this
            },
            toggleClass: function(o, t) {
                var r = typeof o,
                    s = "string" === r || Array.isArray(o);
                return "boolean" == typeof t && s ? t ? this.addClass(o) : this.removeClass(o) : y(o) ? this.each(function(e) {
                    S(this).toggleClass(o.call(this, e, ht(this), t), t)
                }) : this.each(function() {
                    var e, t, i, n;
                    if (s)
                        for (t = 0,
                            i = S(this),
                            n = gt(o); e = n[t++];)
                            i.hasClass(e) ? i.removeClass(e) : i.addClass(e);
                    else
                        void 0 !== o && "boolean" !== r || ((e = ht(this)) && Q.set(this, "__className__", e),
                            this.setAttribute && this.setAttribute("class", e || !1 === o ? "" : Q.get(this, "__className__") || ""))
                })
            },
            hasClass: function(e) {
                var t, i, n = 0;
                for (t = " " + e + " "; i = this[n++];)
                    if (1 === i.nodeType && -1 < (" " + pt(ht(i)) + " ").indexOf(t))
                        return !0;
                return !1
            }
        });
    var vt = /\r/g;
    S.fn.extend({
            val: function(i) {
                var n, e, o, t = this[0];
                return arguments.length ? (o = y(i),
                    this.each(function(e) {
                        var t;
                        1 === this.nodeType && (null == (t = o ? i.call(this, e, S(this).val()) : i) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = S.map(t, function(e) {
                                return null == e ? "" : e + ""
                            })),
                            (n = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set" in n && void 0 !== n.set(this, t, "value") || (this.value = t))
                    })) : t ? (n = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) && "get" in n && void 0 !== (e = n.get(t, "value")) ? e : "string" == typeof(e = t.value) ? e.replace(vt, "") : null == e ? "" : e : void 0
            }
        }),
        S.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = S.find.attr(e, "value");
                        return null != t ? t : pt(S.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        var t, i, n, o = e.options,
                            r = e.selectedIndex,
                            s = "select-one" === e.type,
                            a = s ? null : [],
                            l = s ? r + 1 : o.length;
                        for (n = r < 0 ? l : s ? r : 0; n < l; n++)
                            if (((i = o[n]).selected || n === r) && !i.disabled && (!i.parentNode.disabled || !C(i.parentNode, "optgroup"))) {
                                if (t = S(i).val(),
                                    s)
                                    return t;
                                a.push(t)
                            }
                        return a
                    },
                    set: function(e, t) {
                        for (var i, n, o = e.options, r = S.makeArray(t), s = o.length; s--;)
                            ((n = o[s]).selected = -1 < S.inArray(S.valHooks.option.get(n), r)) && (i = !0);
                        return i || (e.selectedIndex = -1),
                            r
                    }
                }
            }
        }),
        S.each(["radio", "checkbox"], function() {
            S.valHooks[this] = {
                    set: function(e, t) {
                        if (Array.isArray(t))
                            return e.checked = -1 < S.inArray(S(e).val(), t)
                    }
                },
                m.checkOn || (S.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                })
        }),
        m.focusin = "onfocusin" in k;
    var mt = /^(?:focusinfocus|focusoutblur)$/,
        yt = function(e) {
            e.stopPropagation()
        };
    S.extend(S.event, {
            trigger: function(e, t, i, n) {
                var o, r, s, a, l, c, d, u, f = [i || T],
                    p = v.call(e, "type") ? e.type : e,
                    h = v.call(e, "namespace") ? e.namespace.split(".") : [];
                if (r = u = s = i = i || T,
                    3 !== i.nodeType && 8 !== i.nodeType && !mt.test(p + S.event.triggered) && (-1 < p.indexOf(".") && (p = (h = p.split(".")).shift(),
                            h.sort()),
                        l = p.indexOf(":") < 0 && "on" + p,
                        (e = e[S.expando] ? e : new S.Event(p, "object" == typeof e && e)).isTrigger = n ? 2 : 3,
                        e.namespace = h.join("."),
                        e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                        e.result = void 0,
                        e.target || (e.target = i),
                        t = null == t ? [e] : S.makeArray(t, [e]),
                        d = S.event.special[p] || {},
                        n || !d.trigger || !1 !== d.trigger.apply(i, t))) {
                    if (!n && !d.noBubble && !b(i)) {
                        for (a = d.delegateType || p,
                            mt.test(a + p) || (r = r.parentNode); r; r = r.parentNode)
                            f.push(r),
                            s = r;
                        s === (i.ownerDocument || T) && f.push(s.defaultView || s.parentWindow || k)
                    }
                    for (o = 0;
                        (r = f[o++]) && !e.isPropagationStopped();)
                        u = r,
                        e.type = 1 < o ? a : d.bindType || p,
                        (c = (Q.get(r, "events") || {})[e.type] && Q.get(r, "handle")) && c.apply(r, t),
                        (c = l && r[l]) && c.apply && Y(r) && (e.result = c.apply(r, t), !1 === e.result && e.preventDefault());
                    return e.type = p,
                        n || e.isDefaultPrevented() || d._default && !1 !== d._default.apply(f.pop(), t) || !Y(i) || l && y(i[p]) && !b(i) && ((s = i[l]) && (i[l] = null),
                            S.event.triggered = p,
                            e.isPropagationStopped() && u.addEventListener(p, yt),
                            i[p](),
                            e.isPropagationStopped() && u.removeEventListener(p, yt),
                            S.event.triggered = void 0,
                            s && (i[l] = s)),
                        e.result
                }
            },
            simulate: function(e, t, i) {
                var n = S.extend(new S.Event, i, {
                    type: e,
                    isSimulated: !0
                });
                S.event.trigger(n, null, t)
            }
        }),
        S.fn.extend({
            trigger: function(e, t) {
                return this.each(function() {
                    S.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var i = this[0];
                if (i)
                    return S.event.trigger(e, t, i, !0)
            }
        }),
        m.focusin || S.each({
            focus: "focusin",
            blur: "focusout"
        }, function(i, n) {
            var o = function(e) {
                S.event.simulate(n, e.target, S.event.fix(e))
            };
            S.event.special[n] = {
                setup: function() {
                    var e = this.ownerDocument || this,
                        t = Q.access(e, n);
                    t || e.addEventListener(i, o, !0),
                        Q.access(e, n, (t || 0) + 1)
                },
                teardown: function() {
                    var e = this.ownerDocument || this,
                        t = Q.access(e, n) - 1;
                    t ? Q.access(e, n, t) : (e.removeEventListener(i, o, !0),
                        Q.remove(e, n))
                }
            }
        });
    var bt = k.location,
        wt = Date.now(),
        xt = /\?/;
    S.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new k.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || S.error("Invalid XML: " + e),
            t
    };
    var _t = /\[\]$/,
        kt = /\r?\n/g,
        Tt = /^(?:submit|button|image|reset|file)$/i,
        St = /^(?:input|select|textarea|keygen)/i;

    function Et(i, e, n, o) {
        var t;
        if (Array.isArray(e))
            S.each(e, function(e, t) {
                n || _t.test(i) ? o(i, t) : Et(i + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, n, o)
            });
        else if (n || "object" !== x(e))
            o(i, e);
        else
            for (t in e)
                Et(i + "[" + t + "]", e[t], n, o)
    }
    S.param = function(e, t) {
            var i, n = [],
                o = function(e, t) {
                    var i = y(t) ? t() : t;
                    n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == i ? "" : i)
                };
            if (Array.isArray(e) || e.jquery && !S.isPlainObject(e))
                S.each(e, function() {
                    o(this.name, this.value)
                });
            else
                for (i in e)
                    Et(i, e[i], t, o);
            return n.join("&")
        },
        S.fn.extend({
            serialize: function() {
                return S.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = S.prop(this, "elements");
                    return e ? S.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !S(this).is(":disabled") && St.test(this.nodeName) && !Tt.test(e) && (this.checked || !le.test(e))
                }).map(function(e, t) {
                    var i = S(this).val();
                    return null == i ? null : Array.isArray(i) ? S.map(i, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(kt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: i.replace(kt, "\r\n")
                    }
                }).get()
            }
        });
    var Ct = /%20/g,
        At = /#.*$/,
        Ot = /([?&])_=[^&]*/,
        Dt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Nt = /^(?:GET|HEAD)$/,
        Lt = /^\/\//,
        It = {},
        jt = {},
        $t = "*/".concat("*"),
        Mt = T.createElement("a");

    function Pt(r) {
        return function(e, t) {
            "string" != typeof e && (t = e,
                e = "*");
            var i, n = 0,
                o = e.toLowerCase().match($) || [];
            if (y(t))
                for (; i = o[n++];)
                    "+" === i[0] ? (i = i.slice(1) || "*",
                        (r[i] = r[i] || []).unshift(t)) : (r[i] = r[i] || []).push(t)
        }
    }

    function Ht(t, o, r, s) {
        var a = {},
            l = t === jt;

        function c(e) {
            var n;
            return a[e] = !0,
                S.each(t[e] || [], function(e, t) {
                    var i = t(o, r, s);
                    return "string" != typeof i || l || a[i] ? l ? !(n = i) : void 0 : (o.dataTypes.unshift(i),
                        c(i), !1)
                }),
                n
        }
        return c(o.dataTypes[0]) || !a["*"] && c("*")
    }

    function qt(e, t) {
        var i, n, o = S.ajaxSettings.flatOptions || {};
        for (i in t)
            void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
        return n && S.extend(!0, e, n),
            e
    }
    Mt.href = bt.href,
        S.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: bt.href,
                type: "GET",
                isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": $t,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": S.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? qt(qt(e, S.ajaxSettings), t) : qt(S.ajaxSettings, e)
            },
            ajaxPrefilter: Pt(It),
            ajaxTransport: Pt(jt),
            ajax: function(e, t) {
                "object" == typeof e && (t = e,
                        e = void 0),
                    t = t || {};
                var d, u, f, i, p, n, h, g, o, r, v = S.ajaxSetup({}, t),
                    m = v.context || v,
                    y = v.context && (m.nodeType || m.jquery) ? S(m) : S.event,
                    b = S.Deferred(),
                    w = S.Callbacks("once memory"),
                    x = v.statusCode || {},
                    s = {},
                    a = {},
                    l = "canceled",
                    _ = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (h) {
                                if (!i)
                                    for (i = {}; t = Dt.exec(f);)
                                        i[t[1].toLowerCase()] = t[2];
                                t = i[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return h ? f : null
                        },
                        setRequestHeader: function(e, t) {
                            return null == h && (e = a[e.toLowerCase()] = a[e.toLowerCase()] || e,
                                    s[e] = t),
                                this
                        },
                        overrideMimeType: function(e) {
                            return null == h && (v.mimeType = e),
                                this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (h)
                                    _.always(e[_.status]);
                                else
                                    for (t in e)
                                        x[t] = [x[t], e[t]];
                            return this
                        },
                        abort: function(e) {
                            var t = e || l;
                            return d && d.abort(t),
                                c(0, t),
                                this
                        }
                    };
                if (b.promise(_),
                    v.url = ((e || v.url || bt.href) + "").replace(Lt, bt.protocol + "//"),
                    v.type = t.method || t.type || v.method || v.type,
                    v.dataTypes = (v.dataType || "*").toLowerCase().match($) || [""],
                    null == v.crossDomain) {
                    n = T.createElement("a");
                    try {
                        n.href = v.url,
                            n.href = n.href,
                            v.crossDomain = Mt.protocol + "//" + Mt.host != n.protocol + "//" + n.host
                    } catch (e) {
                        v.crossDomain = !0
                    }
                }
                if (v.data && v.processData && "string" != typeof v.data && (v.data = S.param(v.data, v.traditional)),
                    Ht(It, v, t, _),
                    h)
                    return _;
                for (o in (g = S.event && v.global) && 0 == S.active++ && S.event.trigger("ajaxStart"),
                    v.type = v.type.toUpperCase(),
                    v.hasContent = !Nt.test(v.type),
                    u = v.url.replace(At, ""),
                    v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Ct, "+")) : (r = v.url.slice(u.length),
                        v.data && (v.processData || "string" == typeof v.data) && (u += (xt.test(u) ? "&" : "?") + v.data,
                            delete v.data), !1 === v.cache && (u = u.replace(Ot, "$1"),
                            r = (xt.test(u) ? "&" : "?") + "_=" + wt++ + r),
                        v.url = u + r),
                    v.ifModified && (S.lastModified[u] && _.setRequestHeader("If-Modified-Since", S.lastModified[u]),
                        S.etag[u] && _.setRequestHeader("If-None-Match", S.etag[u])),
                    (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && _.setRequestHeader("Content-Type", v.contentType),
                    _.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + $t + "; q=0.01" : "") : v.accepts["*"]),
                    v.headers)
                    _.setRequestHeader(o, v.headers[o]);
                if (v.beforeSend && (!1 === v.beforeSend.call(m, _, v) || h))
                    return _.abort();
                if (l = "abort",
                    w.add(v.complete),
                    _.done(v.success),
                    _.fail(v.error),
                    d = Ht(jt, v, t, _)) {
                    if (_.readyState = 1,
                        g && y.trigger("ajaxSend", [_, v]),
                        h)
                        return _;
                    v.async && 0 < v.timeout && (p = k.setTimeout(function() {
                        _.abort("timeout")
                    }, v.timeout));
                    try {
                        h = !1,
                            d.send(s, c)
                    } catch (e) {
                        if (h)
                            throw e;
                        c(-1, e)
                    }
                } else
                    c(-1, "No Transport");

                function c(e, t, i, n) {
                    var o, r, s, a, l, c = t;
                    h || (h = !0,
                        p && k.clearTimeout(p),
                        d = void 0,
                        f = n || "",
                        _.readyState = 0 < e ? 4 : 0,
                        o = 200 <= e && e < 300 || 304 === e,
                        i && (a = function(e, t, i) {
                            for (var n, o, r, s, a = e.contents, l = e.dataTypes;
                                "*" === l[0];)
                                l.shift(),
                                void 0 === n && (n = e.mimeType || t.getResponseHeader("Content-Type"));
                            if (n)
                                for (o in a)
                                    if (a[o] && a[o].test(n)) {
                                        l.unshift(o);
                                        break
                                    }
                            if (l[0] in i)
                                r = l[0];
                            else {
                                for (o in i) {
                                    if (!l[0] || e.converters[o + " " + l[0]]) {
                                        r = o;
                                        break
                                    }
                                    s || (s = o)
                                }
                                r = r || s
                            }
                            if (r)
                                return r !== l[0] && l.unshift(r),
                                    i[r]
                        }(v, _, i)),
                        a = function(e, t, i, n) {
                            var o, r, s, a, l, c = {},
                                d = e.dataTypes.slice();
                            if (d[1])
                                for (s in e.converters)
                                    c[s.toLowerCase()] = e.converters[s];
                            for (r = d.shift(); r;)
                                if (e.responseFields[r] && (i[e.responseFields[r]] = t), !l && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                                    l = r,
                                    r = d.shift())
                                    if ("*" === r)
                                        r = l;
                                    else if ("*" !== l && l !== r) {
                                if (!(s = c[l + " " + r] || c["* " + r]))
                                    for (o in c)
                                        if ((a = o.split(" "))[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                                            !0 === s ? s = c[o] : !0 !== c[o] && (r = a[0],
                                                d.unshift(a[1]));
                                            break
                                        }
                                if (!0 !== s)
                                    if (s && e.throws)
                                        t = s(t);
                                    else
                                        try {
                                            t = s(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: s ? e : "No conversion from " + l + " to " + r
                                            }
                                        }
                            }
                            return {
                                state: "success",
                                data: t
                            }
                        }(v, a, _, o),
                        o ? (v.ifModified && ((l = _.getResponseHeader("Last-Modified")) && (S.lastModified[u] = l),
                                (l = _.getResponseHeader("etag")) && (S.etag[u] = l)),
                            204 === e || "HEAD" === v.type ? c = "nocontent" : 304 === e ? c = "notmodified" : (c = a.state,
                                r = a.data,
                                o = !(s = a.error))) : (s = c, !e && c || (c = "error",
                            e < 0 && (e = 0))),
                        _.status = e,
                        _.statusText = (t || c) + "",
                        o ? b.resolveWith(m, [r, c, _]) : b.rejectWith(m, [_, c, s]),
                        _.statusCode(x),
                        x = void 0,
                        g && y.trigger(o ? "ajaxSuccess" : "ajaxError", [_, v, o ? r : s]),
                        w.fireWith(m, [_, c]),
                        g && (y.trigger("ajaxComplete", [_, v]),
                            --S.active || S.event.trigger("ajaxStop")))
                }
                return _
            },
            getJSON: function(e, t, i) {
                return S.get(e, t, i, "json")
            },
            getScript: function(e, t) {
                return S.get(e, void 0, t, "script")
            }
        }),
        S.each(["get", "post"], function(e, o) {
            S[o] = function(e, t, i, n) {
                return y(t) && (n = n || i,
                        i = t,
                        t = void 0),
                    S.ajax(S.extend({
                        url: e,
                        type: o,
                        dataType: n,
                        data: t,
                        success: i
                    }, S.isPlainObject(e) && e))
            }
        }),
        S._evalUrl = function(e) {
            return S.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        },
        S.fn.extend({
            wrapAll: function(e) {
                var t;
                return this[0] && (y(e) && (e = e.call(this[0])),
                        t = S(e, this[0].ownerDocument).eq(0).clone(!0),
                        this[0].parentNode && t.insertBefore(this[0]),
                        t.map(function() {
                            for (var e = this; e.firstElementChild;)
                                e = e.firstElementChild;
                            return e
                        }).append(this)),
                    this
            },
            wrapInner: function(i) {
                return y(i) ? this.each(function(e) {
                    S(this).wrapInner(i.call(this, e))
                }) : this.each(function() {
                    var e = S(this),
                        t = e.contents();
                    t.length ? t.wrapAll(i) : e.append(i)
                })
            },
            wrap: function(t) {
                var i = y(t);
                return this.each(function(e) {
                    S(this).wrapAll(i ? t.call(this, e) : t)
                })
            },
            unwrap: function(e) {
                return this.parent(e).not("body").each(function() {
                        S(this).replaceWith(this.childNodes)
                    }),
                    this
            }
        }),
        S.expr.pseudos.hidden = function(e) {
            return !S.expr.pseudos.visible(e)
        },
        S.expr.pseudos.visible = function(e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
        },
        S.ajaxSettings.xhr = function() {
            try {
                return new k.XMLHttpRequest
            } catch (e) {}
        };
    var Wt = {
            0: 200,
            1223: 204
        },
        Rt = S.ajaxSettings.xhr();
    m.cors = !!Rt && "withCredentials" in Rt,
        m.ajax = Rt = !!Rt,
        S.ajaxTransport(function(o) {
            var r, s;
            if (m.cors || Rt && !o.crossDomain)
                return {
                    send: function(e, t) {
                        var i, n = o.xhr();
                        if (n.open(o.type, o.url, o.async, o.username, o.password),
                            o.xhrFields)
                            for (i in o.xhrFields)
                                n[i] = o.xhrFields[i];
                        for (i in o.mimeType && n.overrideMimeType && n.overrideMimeType(o.mimeType),
                            o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                            e)
                            n.setRequestHeader(i, e[i]);
                        r = function(e) {
                                return function() {
                                    r && (r = s = n.onload = n.onerror = n.onabort = n.ontimeout = n.onreadystatechange = null,
                                        "abort" === e ? n.abort() : "error" === e ? "number" != typeof n.status ? t(0, "error") : t(n.status, n.statusText) : t(Wt[n.status] || n.status, n.statusText, "text" !== (n.responseType || "text") || "string" != typeof n.responseText ? {
                                            binary: n.response
                                        } : {
                                            text: n.responseText
                                        }, n.getAllResponseHeaders()))
                                }
                            },
                            n.onload = r(),
                            s = n.onerror = n.ontimeout = r("error"),
                            void 0 !== n.onabort ? n.onabort = s : n.onreadystatechange = function() {
                                4 === n.readyState && k.setTimeout(function() {
                                    r && s()
                                })
                            },
                            r = r("abort");
                        try {
                            n.send(o.hasContent && o.data || null)
                        } catch (e) {
                            if (r)
                                throw e
                        }
                    },
                    abort: function() {
                        r && r()
                    }
                }
        }),
        S.ajaxPrefilter(function(e) {
            e.crossDomain && (e.contents.script = !1)
        }),
        S.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return S.globalEval(e),
                        e
                }
            }
        }),
        S.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1),
                e.crossDomain && (e.type = "GET")
        }),
        S.ajaxTransport("script", function(i) {
            var n, o;
            if (i.crossDomain)
                return {
                    send: function(e, t) {
                        n = S("<script>").prop({
                                charset: i.scriptCharset,
                                src: i.url
                            }).on("load error", o = function(e) {
                                n.remove(),
                                    o = null,
                                    e && t("error" === e.type ? 404 : 200, e.type)
                            }),
                            T.head.appendChild(n[0])
                    },
                    abort: function() {
                        o && o()
                    }
                }
        });
    var Ft, zt = [],
        Bt = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = zt.pop() || S.expando + "_" + wt++;
                return this[e] = !0,
                    e
            }
        }),
        S.ajaxPrefilter("json jsonp", function(e, t, i) {
            var n, o, r, s = !1 !== e.jsonp && (Bt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Bt.test(e.data) && "data");
            if (s || "jsonp" === e.dataTypes[0])
                return n = e.jsonpCallback = y(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
                    s ? e[s] = e[s].replace(Bt, "$1" + n) : !1 !== e.jsonp && (e.url += (xt.test(e.url) ? "&" : "?") + e.jsonp + "=" + n),
                    e.converters["script json"] = function() {
                        return r || S.error(n + " was not called"),
                            r[0]
                    },
                    e.dataTypes[0] = "json",
                    o = k[n],
                    k[n] = function() {
                        r = arguments
                    },
                    i.always(function() {
                        void 0 === o ? S(k).removeProp(n) : k[n] = o,
                            e[n] && (e.jsonpCallback = t.jsonpCallback,
                                zt.push(n)),
                            r && y(o) && o(r[0]),
                            r = o = void 0
                    }),
                    "script"
        }),
        m.createHTMLDocument = ((Ft = T.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
            2 === Ft.childNodes.length),
        S.parseHTML = function(e, t, i) {
            return "string" != typeof e ? [] : ("boolean" == typeof t && (i = t,
                    t = !1),
                t || (m.createHTMLDocument ? ((n = (t = T.implementation.createHTMLDocument("")).createElement("base")).href = T.location.href,
                    t.head.appendChild(n)) : t = T),
                r = !i && [],
                (o = A.exec(e)) ? [t.createElement(o[1])] : (o = me([e], t, r),
                    r && r.length && S(r).remove(),
                    S.merge([], o.childNodes)));
            var n, o, r
        },
        S.fn.load = function(e, t, i) {
            var n, o, r, s = this,
                a = e.indexOf(" ");
            return -1 < a && (n = pt(e.slice(a)),
                    e = e.slice(0, a)),
                y(t) ? (i = t,
                    t = void 0) : t && "object" == typeof t && (o = "POST"),
                0 < s.length && S.ajax({
                    url: e,
                    type: o || "GET",
                    dataType: "html",
                    data: t
                }).done(function(e) {
                    r = arguments,
                        s.html(n ? S("<div>").append(S.parseHTML(e)).find(n) : e)
                }).always(i && function(e, t) {
                    s.each(function() {
                        i.apply(this, r || [e.responseText, t, e])
                    })
                }),
                this
        },
        S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            S.fn[t] = function(e) {
                return this.on(t, e)
            }
        }),
        S.expr.pseudos.animated = function(t) {
            return S.grep(S.timers, function(e) {
                return t === e.elem
            }).length
        },
        S.offset = {
            setOffset: function(e, t, i) {
                var n, o, r, s, a, l, c = S.css(e, "position"),
                    d = S(e),
                    u = {};
                "static" === c && (e.style.position = "relative"),
                    a = d.offset(),
                    r = S.css(e, "top"),
                    l = S.css(e, "left"),
                    o = ("absolute" === c || "fixed" === c) && -1 < (r + l).indexOf("auto") ? (s = (n = d.position()).top,
                        n.left) : (s = parseFloat(r) || 0,
                        parseFloat(l) || 0),
                    y(t) && (t = t.call(e, i, S.extend({}, a))),
                    null != t.top && (u.top = t.top - a.top + s),
                    null != t.left && (u.left = t.left - a.left + o),
                    "using" in t ? t.using.call(e, u) : d.css(u)
            }
        },
        S.fn.extend({
            offset: function(t) {
                if (arguments.length)
                    return void 0 === t ? this : this.each(function(e) {
                        S.offset.setOffset(this, t, e)
                    });
                var e, i, n = this[0];
                return n ? n.getClientRects().length ? (e = n.getBoundingClientRect(),
                    i = n.ownerDocument.defaultView, {
                        top: e.top + i.pageYOffset,
                        left: e.left + i.pageXOffset
                    }) : {
                    top: 0,
                    left: 0
                } : void 0
            },
            position: function() {
                if (this[0]) {
                    var e, t, i, n = this[0],
                        o = {
                            top: 0,
                            left: 0
                        };
                    if ("fixed" === S.css(n, "position"))
                        t = n.getBoundingClientRect();
                    else {
                        for (t = this.offset(),
                            i = n.ownerDocument,
                            e = n.offsetParent || i.documentElement; e && (e === i.body || e === i.documentElement) && "static" === S.css(e, "position");)
                            e = e.parentNode;
                        e && e !== n && 1 === e.nodeType && ((o = S(e).offset()).top += S.css(e, "borderTopWidth", !0),
                            o.left += S.css(e, "borderLeftWidth", !0))
                    }
                    return {
                        top: t.top - o.top - S.css(n, "marginTop", !0),
                        left: t.left - o.left - S.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent; e && "static" === S.css(e, "position");)
                        e = e.offsetParent;
                    return e || ye
                })
            }
        }),
        S.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, o) {
            var r = "pageYOffset" === o;
            S.fn[t] = function(e) {
                return F(this, function(e, t, i) {
                    var n;
                    if (b(e) ? n = e : 9 === e.nodeType && (n = e.defaultView),
                        void 0 === i)
                        return n ? n[o] : e[t];
                    n ? n.scrollTo(r ? n.pageXOffset : i, r ? i : n.pageYOffset) : e[t] = i
                }, t, e, arguments.length)
            }
        }),
        S.each(["top", "left"], function(e, i) {
            S.cssHooks[i] = We(m.pixelPosition, function(e, t) {
                if (t)
                    return t = qe(e, i),
                        Me.test(t) ? S(e).position()[i] + "px" : t
            })
        }),
        S.each({
            Height: "height",
            Width: "width"
        }, function(s, a) {
            S.each({
                padding: "inner" + s,
                content: a,
                "": "outer" + s
            }, function(n, r) {
                S.fn[r] = function(e, t) {
                    var i = arguments.length && (n || "boolean" != typeof e),
                        o = n || (!0 === e || !0 === t ? "margin" : "border");
                    return F(this, function(e, t, i) {
                        var n;
                        return b(e) ? 0 === r.indexOf("outer") ? e["inner" + s] : e.document.documentElement["client" + s] : 9 === e.nodeType ? (n = e.documentElement,
                            Math.max(e.body["scroll" + s], n["scroll" + s], e.body["offset" + s], n["offset" + s], n["client" + s])) : void 0 === i ? S.css(e, t, o) : S.style(e, t, i, o)
                    }, a, i ? e : void 0, i)
                }
            })
        }),
        S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, i) {
            S.fn[i] = function(e, t) {
                return 0 < arguments.length ? this.on(i, null, e, t) : this.trigger(i)
            }
        }),
        S.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        }),
        S.fn.extend({
            bind: function(e, t, i) {
                return this.on(e, null, t, i)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, i, n) {
                return this.on(t, e, i, n)
            },
            undelegate: function(e, t, i) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i)
            }
        }),
        S.proxy = function(e, t) {
            var i, n, o;
            if ("string" == typeof t && (i = e[t],
                    t = e,
                    e = i),
                y(e))
                return n = a.call(arguments, 2),
                    (o = function() {
                        return e.apply(t || this, n.concat(a.call(arguments)))
                    }).guid = e.guid = e.guid || S.guid++,
                    o
        },
        S.holdReady = function(e) {
            e ? S.readyWait++ : S.ready(!0)
        },
        S.isArray = Array.isArray,
        S.parseJSON = JSON.parse,
        S.nodeName = C,
        S.isFunction = y,
        S.isWindow = b,
        S.camelCase = V,
        S.type = x,
        S.now = Date.now,
        S.isNumeric = function(e) {
            var t = S.type(e);
            return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
        },
        "function" == typeof define && define.amd && define("jquery", [], function() {
            return S
        });
    var Ut = k.jQuery,
        Vt = k.$;
    return S.noConflict = function(e) {
            return k.$ === S && (k.$ = Vt),
                e && k.jQuery === S && (k.jQuery = Ut),
                S
        },
        e || (k.jQuery = k.$ = S),
        S
}),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Popper = t()
}(this,
    function() {
        "use strict";

        function s(e) {
            return e && "[object Function]" === {}.toString.call(e)
        }

        function w(e, t) {
            if (1 !== e.nodeType)
                return [];
            var i = getComputedStyle(e, null);
            return t ? i[t] : i
        }

        function f(e) {
            return "HTML" === e.nodeName ? e : e.parentNode || e.host
        }

        function h(e) {
            if (!e)
                return document.body;
            switch (e.nodeName) {
                case "HTML":
                case "BODY":
                    return e.ownerDocument.body;
                case "#document":
                    return e.body
            }
            var t = w(e),
                i = t.overflow,
                n = t.overflowX,
                o = t.overflowY;
            return /(auto|scroll|overlay)/.test(i + o + n) ? e : h(f(e))
        }

        function g(e) {
            return 11 === e ? z : 10 === e ? B : z || B
        }

        function y(e) {
            if (!e)
                return document.documentElement;
            for (var t = g(10) ? document.body : null, i = e.offsetParent; i === t && e.nextElementSibling;)
                i = (e = e.nextElementSibling).offsetParent;
            var n = i && i.nodeName;
            return n && "BODY" !== n && "HTML" !== n ? -1 !== ["TD", "TABLE"].indexOf(i.nodeName) && "static" === w(i, "position") ? y(i) : i : e ? e.ownerDocument.documentElement : document.documentElement
        }

        function d(e) {
            return null === e.parentNode ? e : d(e.parentNode)
        }

        function p(e, t) {
            if (!(e && e.nodeType && t && t.nodeType))
                return document.documentElement;
            var i = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
                n = i ? e : t,
                o = i ? t : e,
                r = document.createRange();
            r.setStart(n, 0),
                r.setEnd(o, 0);
            var s, a, l = r.commonAncestorContainer;
            if (e !== l && t !== l || n.contains(o))
                return "BODY" === (a = (s = l).nodeName) || "HTML" !== a && y(s.firstElementChild) !== s ? y(l) : l;
            var c = d(e);
            return c.host ? p(c.host, t) : p(e, d(t).host)
        }

        function v(e) {
            var t = "top" === (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "top") ? "scrollTop" : "scrollLeft",
                i = e.nodeName;
            if ("BODY" !== i && "HTML" !== i)
                return e[t];
            var n = e.ownerDocument.documentElement;
            return (e.ownerDocument.scrollingElement || n)[t]
        }

        function u(e, t) {
            var i = "x" === t ? "Left" : "Top",
                n = "Left" == i ? "Right" : "Bottom";
            return parseFloat(e["border" + i + "Width"], 10) + parseFloat(e["border" + n + "Width"], 10)
        }

        function n(e, t, i, n) {
            return P(t["offset" + e], t["scroll" + e], i["client" + e], i["offset" + e], i["scroll" + e], g(10) ? i["offset" + e] + n["margin" + ("Height" === e ? "Top" : "Left")] + n["margin" + ("Height" === e ? "Bottom" : "Right")] : 0)
        }

        function m() {
            var e = document.body,
                t = document.documentElement,
                i = g(10) && getComputedStyle(t);
            return {
                height: n("Height", e, t, i),
                width: n("Width", e, t, i)
            }
        }

        function x(e) {
            return Y({}, e, {
                right: e.left + e.width,
                bottom: e.top + e.height
            })
        }

        function b(e) {
            var t = {};
            try {
                if (g(10)) {
                    t = e.getBoundingClientRect();
                    var i = v(e, "top"),
                        n = v(e, "left");
                    t.top += i,
                        t.left += n,
                        t.bottom += i,
                        t.right += n
                } else
                    t = e.getBoundingClientRect()
            } catch (e) {}
            var o = {
                    left: t.left,
                    top: t.top,
                    width: t.right - t.left,
                    height: t.bottom - t.top
                },
                r = "HTML" === e.nodeName ? m() : {},
                s = r.width || e.clientWidth || o.right - o.left,
                a = r.height || e.clientHeight || o.bottom - o.top,
                l = e.offsetWidth - s,
                c = e.offsetHeight - a;
            if (l || c) {
                var d = w(e);
                l -= u(d, "x"),
                    c -= u(d, "y"),
                    o.width -= l,
                    o.height -= c
            }
            return x(o)
        }

        function _(e, t) {
            var i = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
                n = g(10),
                o = "HTML" === t.nodeName,
                r = b(e),
                s = b(t),
                a = h(e),
                l = w(t),
                c = parseFloat(l.borderTopWidth, 10),
                d = parseFloat(l.borderLeftWidth, 10);
            i && "HTML" === t.nodeName && (s.top = P(s.top, 0),
                s.left = P(s.left, 0));
            var u = x({
                top: r.top - s.top - c,
                left: r.left - s.left - d,
                width: r.width,
                height: r.height
            });
            if (u.marginTop = 0,
                u.marginLeft = 0, !n && o) {
                var f = parseFloat(l.marginTop, 10),
                    p = parseFloat(l.marginLeft, 10);
                u.top -= c - f,
                    u.bottom -= c - f,
                    u.left -= d - p,
                    u.right -= d - p,
                    u.marginTop = f,
                    u.marginLeft = p
            }
            return (n && !i ? t.contains(a) : t === a && "BODY" !== a.nodeName) && (u = function(e, t) {
                    var i = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
                        n = v(t, "top"),
                        o = v(t, "left"),
                        r = i ? -1 : 1;
                    return e.top += n * r,
                        e.bottom += n * r,
                        e.left += o * r,
                        e.right += o * r,
                        e
                }(u, t)),
                u
        }

        function k(e) {
            if (!e || !e.parentElement || g())
                return document.documentElement;
            for (var t = e.parentElement; t && "none" === w(t, "transform");)
                t = t.parentElement;
            return t || document.documentElement
        }

        function T(e, t, i, n) {
            var o = 4 < arguments.length && void 0 !== arguments[4] && arguments[4],
                r = {
                    top: 0,
                    left: 0
                },
                s = o ? k(e) : p(e, t);
            if ("viewport" === n)
                r = function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                        i = e.ownerDocument.documentElement,
                        n = _(e, i),
                        o = P(i.clientWidth, window.innerWidth || 0),
                        r = P(i.clientHeight, window.innerHeight || 0),
                        s = t ? 0 : v(i),
                        a = t ? 0 : v(i, "left");
                    return x({
                        top: s - n.top + n.marginTop,
                        left: a - n.left + n.marginLeft,
                        width: o,
                        height: r
                    })
                }(s, o);
            else {
                var a;
                "scrollParent" === n ? "BODY" === (a = h(f(t))).nodeName && (a = e.ownerDocument.documentElement) : a = "window" === n ? e.ownerDocument.documentElement : n;
                var l = _(a, s, o);
                if ("HTML" !== a.nodeName || function e(t) {
                        var i = t.nodeName;
                        return "BODY" !== i && "HTML" !== i && ("fixed" === w(t, "position") || e(f(t)))
                    }(s))
                    r = l;
                else {
                    var c = m(),
                        d = c.height,
                        u = c.width;
                    r.top += l.top - l.marginTop,
                        r.bottom = d + l.top,
                        r.left += l.left - l.marginLeft,
                        r.right = u + l.left
                }
            }
            return r.left += i,
                r.top += i,
                r.right -= i,
                r.bottom -= i,
                r
        }

        function a(e, t, n, i, o) {
            var r = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
            if (-1 === e.indexOf("auto"))
                return e;
            var s = T(n, i, r, o),
                a = {
                    top: {
                        width: s.width,
                        height: t.top - s.top
                    },
                    right: {
                        width: s.right - t.right,
                        height: s.height
                    },
                    bottom: {
                        width: s.width,
                        height: s.bottom - t.bottom
                    },
                    left: {
                        width: t.left - s.left,
                        height: s.height
                    }
                },
                l = Object.keys(a).map(function(e) {
                    return Y({
                        key: e
                    }, a[e], {
                        area: (t = a[e],
                            t.width * t.height)
                    });
                    var t
                }).sort(function(e, t) {
                    return t.area - e.area
                }),
                c = l.filter(function(e) {
                    var t = e.width,
                        i = e.height;
                    return t >= n.clientWidth && i >= n.clientHeight
                }),
                d = 0 < c.length ? c[0].key : l[0].key,
                u = e.split("-")[1];
            return d + (u ? "-" + u : "")
        }

        function l(e, t, i) {
            var n = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
            return _(i, n ? k(t) : p(t, i), n)
        }

        function S(e) {
            var t = getComputedStyle(e),
                i = parseFloat(t.marginTop) + parseFloat(t.marginBottom),
                n = parseFloat(t.marginLeft) + parseFloat(t.marginRight);
            return {
                width: e.offsetWidth + n,
                height: e.offsetHeight + i
            }
        }

        function E(e) {
            var t = {
                left: "right",
                right: "left",
                bottom: "top",
                top: "bottom"
            };
            return e.replace(/left|right|bottom|top/g, function(e) {
                return t[e]
            })
        }

        function C(e, t, i) {
            i = i.split("-")[0];
            var n = S(e),
                o = {
                    width: n.width,
                    height: n.height
                },
                r = -1 !== ["right", "left"].indexOf(i),
                s = r ? "top" : "left",
                a = r ? "left" : "top",
                l = r ? "height" : "width",
                c = r ? "width" : "height";
            return o[s] = t[s] + t[l] / 2 - n[l] / 2,
                o[a] = i === a ? t[a] - n[c] : t[E(a)],
                o
        }

        function A(e, t) {
            return Array.prototype.find ? e.find(t) : e.filter(t)[0]
        }

        function O(e, i, t) {
            return (void 0 === t ? e : e.slice(0, function(e, t, i) {
                    if (Array.prototype.findIndex)
                        return e.findIndex(function(e) {
                            return e[t] === i
                        });
                    var n = A(e, function(e) {
                        return e[t] === i
                    });
                    return e.indexOf(n)
                }(e, "name", t))).forEach(function(e) {
                    e.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
                    var t = e.function || e.fn;
                    e.enabled && s(t) && (i.offsets.popper = x(i.offsets.popper),
                        i.offsets.reference = x(i.offsets.reference),
                        i = t(i, e))
                }),
                i
        }

        function e(e, i) {
            return e.some(function(e) {
                var t = e.name;
                return e.enabled && t === i
            })
        }

        function D(e) {
            for (var t = [!1, "ms", "Webkit", "Moz", "O"], i = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < t.length; n++) {
                var o = t[n],
                    r = o ? "" + o + i : e;
                if (void 0 !== document.body.style[r])
                    return r
            }
            return null
        }

        function r(e) {
            var t = e.ownerDocument;
            return t ? t.defaultView : window
        }

        function t(e, t, i, n) {
            i.updateBound = n,
                r(e).addEventListener("resize", i.updateBound, {
                    passive: !0
                });
            var o = h(e);
            return function e(t, i, n, o) {
                    var r = "BODY" === t.nodeName,
                        s = r ? t.ownerDocument.defaultView : t;
                    s.addEventListener(i, n, {
                            passive: !0
                        }),
                        r || e(h(s.parentNode), i, n, o),
                        o.push(s)
                }(o, "scroll", i.updateBound, i.scrollParents),
                i.scrollElement = o,
                i.eventsEnabled = !0,
                i
        }

        function i() {
            var e, t;
            this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate),
                this.state = (e = this.reference,
                    t = this.state,
                    r(e).removeEventListener("resize", t.updateBound),
                    t.scrollParents.forEach(function(e) {
                        e.removeEventListener("scroll", t.updateBound)
                    }),
                    t.updateBound = null,
                    t.scrollParents = [],
                    t.scrollElement = null,
                    t.eventsEnabled = !1,
                    t))
        }

        function N(e) {
            return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
        }

        function c(i, n) {
            Object.keys(n).forEach(function(e) {
                var t = ""; -
                1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(e) && N(n[e]) && (t = "px"),
                    i.style[e] = n[e] + t
            })
        }

        function L(e, t, i) {
            var n = A(e, function(e) {
                    return e.name === t
                }),
                o = !!n && e.some(function(e) {
                    return e.name === i && e.enabled && e.order < n.order
                });
            if (!o) {
                var r = "`" + t + "`";
                console.warn("`" + i + "` modifier is required by " + r + " modifier in order to work, be sure to include it before " + r + "!")
            }
            return o
        }

        function o(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                i = Q.indexOf(e),
                n = Q.slice(i + 1).concat(Q.slice(0, i));
            return t ? n.reverse() : n
        }

        function I(e, o, r, t) {
            var s = [0, 0],
                a = -1 !== ["right", "left"].indexOf(t),
                i = e.split(/(\+|\-)/).map(function(e) {
                    return e.trim()
                }),
                n = i.indexOf(A(i, function(e) {
                    return -1 !== e.search(/,|\s/)
                }));
            i[n] && -1 === i[n].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
            var l = /\s*,\s*|\s+/,
                c = -1 === n ? [i] : [i.slice(0, n).concat([i[n].split(l)[0]]), [i[n].split(l)[1]].concat(i.slice(n + 1))];
            return (c = c.map(function(e, t) {
                    var i = (1 === t ? !a : a) ? "height" : "width",
                        n = !1;
                    return e.reduce(function(e, t) {
                        return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t,
                            n = !0,
                            e) : n ? (e[e.length - 1] += t,
                            n = !1,
                            e) : e.concat(t)
                    }, []).map(function(e) {
                        return function(e, t, i, n) {
                            var o, r = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
                                s = +r[1],
                                a = r[2];
                            if (!s)
                                return e;
                            if (0 !== a.indexOf("%"))
                                return "vh" !== a && "vw" !== a ? s : ("vh" === a ? P(document.documentElement.clientHeight, window.innerHeight || 0) : P(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * s;
                            switch (a) {
                                case "%p":
                                    o = i;
                                    break;
                                case "%":
                                case "%r":
                                default:
                                    o = n
                            }
                            return x(o)[t] / 100 * s
                        }(e, i, o, r)
                    })
                })).forEach(function(i, n) {
                    i.forEach(function(e, t) {
                        N(e) && (s[n] += e * ("-" === i[t - 1] ? -1 : 1))
                    })
                }),
                s
        }
        for (var j = Math.min, $ = Math.round, M = Math.floor, P = Math.max, H = "undefined" != typeof window && "undefined" != typeof document, q = ["Edge", "Trident", "Firefox"], W = 0, R = 0; R < q.length; R += 1)
            if (H && 0 <= navigator.userAgent.indexOf(q[R])) {
                W = 1;
                break
            }
        var F = H && window.Promise ? function(e) {
                var t = !1;
                return function() {
                    t || (t = !0,
                        window.Promise.resolve().then(function() {
                            t = !1,
                                e()
                        }))
                }
            } :
            function(e) {
                var t = !1;
                return function() {
                    t || (t = !0,
                        setTimeout(function() {
                            t = !1,
                                e()
                        }, W))
                }
            },
            z = H && !(!window.MSInputMethodContext || !document.documentMode),
            B = H && /MSIE 10/.test(navigator.userAgent),
            U = function() {
                function n(e, t) {
                    for (var i, n = 0; n < t.length; n++)
                        (i = t[n]).enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value" in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                }
                return function(e, t, i) {
                    return t && n(e.prototype, t),
                        i && n(e, i),
                        e
                }
            }(),
            V = function(e, t, i) {
                return t in e ? Object.defineProperty(e, t, {
                        value: i,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = i,
                    e
            },
            Y = Object.assign || function(e) {
                for (var t, i = 1; i < arguments.length; i++)
                    for (var n in t = arguments[i])
                        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                return e
            },
            X = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
            Q = X.slice(3),
            K = "flip",
            G = "clockwise",
            Z = "counterclockwise",
            J = function() {
                function r(e, t) {
                    var i = this,
                        n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                    (function(e, t) {
                        if (!(e instanceof t))
                            throw new TypeError("Cannot call a class as a function")
                    })(this, r),
                    this.scheduleUpdate = function() {
                            return requestAnimationFrame(i.update)
                        },
                        this.update = F(this.update.bind(this)),
                        this.options = Y({}, r.Defaults, n),
                        this.state = {
                            isDestroyed: !1,
                            isCreated: !1,
                            scrollParents: []
                        },
                        this.reference = e && e.jquery ? e[0] : e,
                        this.popper = t && t.jquery ? t[0] : t,
                        this.options.modifiers = {},
                        Object.keys(Y({}, r.Defaults.modifiers, n.modifiers)).forEach(function(e) {
                            i.options.modifiers[e] = Y({}, r.Defaults.modifiers[e] || {}, n.modifiers ? n.modifiers[e] : {})
                        }),
                        this.modifiers = Object.keys(this.options.modifiers).map(function(e) {
                            return Y({
                                name: e
                            }, i.options.modifiers[e])
                        }).sort(function(e, t) {
                            return e.order - t.order
                        }),
                        this.modifiers.forEach(function(e) {
                            e.enabled && s(e.onLoad) && e.onLoad(i.reference, i.popper, i.options, e, i.state)
                        }),
                        this.update();
                    var o = this.options.eventsEnabled;
                    o && this.enableEventListeners(),
                        this.state.eventsEnabled = o
                }
                return U(r, [{
                        key: "update",
                        value: function() {
                            return function() {
                                    if (!this.state.isDestroyed) {
                                        var e = {
                                            instance: this,
                                            styles: {},
                                            arrowStyles: {},
                                            attributes: {},
                                            flipped: !1,
                                            offsets: {}
                                        };
                                        e.offsets.reference = l(this.state, this.popper, this.reference, this.options.positionFixed),
                                            e.placement = a(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding),
                                            e.originalPlacement = e.placement,
                                            e.positionFixed = this.options.positionFixed,
                                            e.offsets.popper = C(this.popper, e.offsets.reference, e.placement),
                                            e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute",
                                            e = O(this.modifiers, e),
                                            this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0,
                                                this.options.onCreate(e))
                                    }
                                }
                                .call(this)
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            return function() {
                                    return this.state.isDestroyed = !0,
                                        e(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"),
                                            this.popper.style.position = "",
                                            this.popper.style.top = "",
                                            this.popper.style.left = "",
                                            this.popper.style.right = "",
                                            this.popper.style.bottom = "",
                                            this.popper.style.willChange = "",
                                            this.popper.style[D("transform")] = ""),
                                        this.disableEventListeners(),
                                        this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper),
                                        this
                                }
                                .call(this)
                        }
                    }, {
                        key: "enableEventListeners",
                        value: function() {
                            return function() {
                                    this.state.eventsEnabled || (this.state = t(this.reference, this.options, this.state, this.scheduleUpdate))
                                }
                                .call(this)
                        }
                    }, {
                        key: "disableEventListeners",
                        value: function() {
                            return i.call(this)
                        }
                    }]),
                    r
            }();
        return J.Utils = ("undefined" == typeof window ? global : window).PopperUtils,
            J.placements = X,
            J.Defaults = {
                placement: "bottom",
                positionFixed: !1,
                eventsEnabled: !0,
                removeOnDestroy: !1,
                onCreate: function() {},
                onUpdate: function() {},
                modifiers: {
                    shift: {
                        order: 100,
                        enabled: !0,
                        fn: function(e) {
                            var t = e.placement,
                                i = t.split("-")[0],
                                n = t.split("-")[1];
                            if (n) {
                                var o = e.offsets,
                                    r = o.reference,
                                    s = o.popper,
                                    a = -1 !== ["bottom", "top"].indexOf(i),
                                    l = a ? "left" : "top",
                                    c = a ? "width" : "height",
                                    d = {
                                        start: V({}, l, r[l]),
                                        end: V({}, l, r[l] + r[c] - s[c])
                                    };
                                e.offsets.popper = Y({}, s, d[n])
                            }
                            return e
                        }
                    },
                    offset: {
                        order: 200,
                        enabled: !0,
                        fn: function(e, t) {
                            var i, n = t.offset,
                                o = e.placement,
                                r = e.offsets,
                                s = r.popper,
                                a = r.reference,
                                l = o.split("-")[0];
                            return i = N(+n) ? [+n, 0] : I(n, s, a, l),
                                "left" === l ? (s.top += i[0],
                                    s.left -= i[1]) : "right" === l ? (s.top += i[0],
                                    s.left += i[1]) : "top" === l ? (s.left += i[0],
                                    s.top -= i[1]) : "bottom" === l && (s.left += i[0],
                                    s.top += i[1]),
                                e.popper = s,
                                e
                        },
                        offset: 0
                    },
                    preventOverflow: {
                        order: 300,
                        enabled: !0,
                        fn: function(e, n) {
                            var t = n.boundariesElement || y(e.instance.popper);
                            e.instance.reference === t && (t = y(t));
                            var i = D("transform"),
                                o = e.instance.popper.style,
                                r = o.top,
                                s = o.left,
                                a = o[i];
                            o.top = "",
                                o.left = "",
                                o[i] = "";
                            var l = T(e.instance.popper, e.instance.reference, n.padding, t, e.positionFixed);
                            o.top = r,
                                o.left = s,
                                o[i] = a,
                                n.boundaries = l;
                            var c = n.priority,
                                d = e.offsets.popper,
                                u = {
                                    primary: function(e) {
                                        var t = d[e];
                                        return d[e] < l[e] && !n.escapeWithReference && (t = P(d[e], l[e])),
                                            V({}, e, t)
                                    },
                                    secondary: function(e) {
                                        var t = "right" === e ? "left" : "top",
                                            i = d[t];
                                        return d[e] > l[e] && !n.escapeWithReference && (i = j(d[t], l[e] - ("right" === e ? d.width : d.height))),
                                            V({}, t, i)
                                    }
                                };
                            return c.forEach(function(e) {
                                    var t = -1 === ["left", "top"].indexOf(e) ? "secondary" : "primary";
                                    d = Y({}, d, u[t](e))
                                }),
                                e.offsets.popper = d,
                                e
                        },
                        priority: ["left", "right", "top", "bottom"],
                        padding: 5,
                        boundariesElement: "scrollParent"
                    },
                    keepTogether: {
                        order: 400,
                        enabled: !0,
                        fn: function(e) {
                            var t = e.offsets,
                                i = t.popper,
                                n = t.reference,
                                o = e.placement.split("-")[0],
                                r = M,
                                s = -1 !== ["top", "bottom"].indexOf(o),
                                a = s ? "right" : "bottom",
                                l = s ? "left" : "top",
                                c = s ? "width" : "height";
                            return i[a] < r(n[l]) && (e.offsets.popper[l] = r(n[l]) - i[c]),
                                i[l] > r(n[a]) && (e.offsets.popper[l] = r(n[a])),
                                e
                        }
                    },
                    arrow: {
                        order: 500,
                        enabled: !0,
                        fn: function(e, t) {
                            var i;
                            if (!L(e.instance.modifiers, "arrow", "keepTogether"))
                                return e;
                            var n = t.element;
                            if ("string" == typeof n) {
                                if (!(n = e.instance.popper.querySelector(n)))
                                    return e
                            } else if (!e.instance.popper.contains(n))
                                return console.warn("WARNING: `arrow.element` must be child of its popper element!"),
                                    e;
                            var o = e.placement.split("-")[0],
                                r = e.offsets,
                                s = r.popper,
                                a = r.reference,
                                l = -1 !== ["left", "right"].indexOf(o),
                                c = l ? "height" : "width",
                                d = l ? "Top" : "Left",
                                u = d.toLowerCase(),
                                f = l ? "left" : "top",
                                p = l ? "bottom" : "right",
                                h = S(n)[c];
                            a[p] - h < s[u] && (e.offsets.popper[u] -= s[u] - (a[p] - h)),
                                a[u] + h > s[p] && (e.offsets.popper[u] += a[u] + h - s[p]),
                                e.offsets.popper = x(e.offsets.popper);
                            var g = a[u] + a[c] / 2 - h / 2,
                                v = w(e.instance.popper),
                                m = parseFloat(v["margin" + d], 10),
                                y = parseFloat(v["border" + d + "Width"], 10),
                                b = g - e.offsets.popper[u] - m - y;
                            return b = P(j(s[c] - h, b), 0),
                                e.arrowElement = n,
                                e.offsets.arrow = (V(i = {}, u, $(b)),
                                    V(i, f, ""),
                                    i),
                                e
                        },
                        element: "[x-arrow]"
                    },
                    flip: {
                        order: 600,
                        enabled: !0,
                        fn: function(h, g) {
                            if (e(h.instance.modifiers, "inner"))
                                return h;
                            if (h.flipped && h.placement === h.originalPlacement)
                                return h;
                            var v = T(h.instance.popper, h.instance.reference, g.padding, g.boundariesElement, h.positionFixed),
                                m = h.placement.split("-")[0],
                                y = E(m),
                                b = h.placement.split("-")[1] || "",
                                w = [];
                            switch (g.behavior) {
                                case K:
                                    w = [m, y];
                                    break;
                                case G:
                                    w = o(m);
                                    break;
                                case Z:
                                    w = o(m, !0);
                                    break;
                                default:
                                    w = g.behavior
                            }
                            return w.forEach(function(e, t) {
                                    if (m !== e || w.length === t + 1)
                                        return h;
                                    m = h.placement.split("-")[0],
                                        y = E(m);
                                    var i, n = h.offsets.popper,
                                        o = h.offsets.reference,
                                        r = M,
                                        s = "left" === m && r(n.right) > r(o.left) || "right" === m && r(n.left) < r(o.right) || "top" === m && r(n.bottom) > r(o.top) || "bottom" === m && r(n.top) < r(o.bottom),
                                        a = r(n.left) < r(v.left),
                                        l = r(n.right) > r(v.right),
                                        c = r(n.top) < r(v.top),
                                        d = r(n.bottom) > r(v.bottom),
                                        u = "left" === m && a || "right" === m && l || "top" === m && c || "bottom" === m && d,
                                        f = -1 !== ["top", "bottom"].indexOf(m),
                                        p = !!g.flipVariations && (f && "start" === b && a || f && "end" === b && l || !f && "start" === b && c || !f && "end" === b && d);
                                    (s || u || p) && (h.flipped = !0,
                                        (s || u) && (m = w[t + 1]),
                                        p && (b = "end" === (i = b) ? "start" : "start" === i ? "end" : i),
                                        h.placement = m + (b ? "-" + b : ""),
                                        h.offsets.popper = Y({}, h.offsets.popper, C(h.instance.popper, h.offsets.reference, h.placement)),
                                        h = O(h.instance.modifiers, h, "flip"))
                                }),
                                h
                        },
                        behavior: "flip",
                        padding: 5,
                        boundariesElement: "viewport"
                    },
                    inner: {
                        order: 700,
                        enabled: !1,
                        fn: function(e) {
                            var t = e.placement,
                                i = t.split("-")[0],
                                n = e.offsets,
                                o = n.popper,
                                r = n.reference,
                                s = -1 !== ["left", "right"].indexOf(i),
                                a = -1 === ["top", "left"].indexOf(i);
                            return o[s ? "left" : "top"] = r[i] - (a ? o[s ? "width" : "height"] : 0),
                                e.placement = E(t),
                                e.offsets.popper = x(o),
                                e
                        }
                    },
                    hide: {
                        order: 800,
                        enabled: !0,
                        fn: function(e) {
                            if (!L(e.instance.modifiers, "hide", "preventOverflow"))
                                return e;
                            var t = e.offsets.reference,
                                i = A(e.instance.modifiers, function(e) {
                                    return "preventOverflow" === e.name
                                }).boundaries;
                            if (t.bottom < i.top || t.left > i.right || t.top > i.bottom || t.right < i.left) {
                                if (!0 === e.hide)
                                    return e;
                                e.hide = !0,
                                    e.attributes["x-out-of-boundaries"] = ""
                            } else {
                                if (!1 === e.hide)
                                    return e;
                                e.hide = !1,
                                    e.attributes["x-out-of-boundaries"] = !1
                            }
                            return e
                        }
                    },
                    computeStyle: {
                        order: 850,
                        enabled: !0,
                        fn: function(e, t) {
                            var i = t.x,
                                n = t.y,
                                o = e.offsets.popper,
                                r = A(e.instance.modifiers, function(e) {
                                    return "applyStyle" === e.name
                                }).gpuAcceleration;
                            void 0 !== r && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
                            var s, a, l = void 0 === r ? t.gpuAcceleration : r,
                                c = b(y(e.instance.popper)),
                                d = {
                                    position: o.position
                                },
                                u = {
                                    left: M(o.left),
                                    top: $(o.top),
                                    bottom: $(o.bottom),
                                    right: M(o.right)
                                },
                                f = "bottom" === i ? "top" : "bottom",
                                p = "right" === n ? "left" : "right",
                                h = D("transform");
                            if (a = "bottom" == f ? -c.height + u.bottom : u.top,
                                s = "right" == p ? -c.width + u.right : u.left,
                                l && h)
                                d[h] = "translate3d(" + s + "px, " + a + "px, 0)",
                                d[f] = 0,
                                d[p] = 0,
                                d.willChange = "transform";
                            else {
                                var g = "bottom" == f ? -1 : 1,
                                    v = "right" == p ? -1 : 1;
                                d[f] = a * g,
                                    d[p] = s * v,
                                    d.willChange = f + ", " + p
                            }
                            var m = {
                                "x-placement": e.placement
                            };
                            return e.attributes = Y({}, m, e.attributes),
                                e.styles = Y({}, d, e.styles),
                                e.arrowStyles = Y({}, e.offsets.arrow, e.arrowStyles),
                                e
                        },
                        gpuAcceleration: !0,
                        x: "bottom",
                        y: "right"
                    },
                    applyStyle: {
                        order: 900,
                        enabled: !0,
                        fn: function(e) {
                            return c(e.instance.popper, e.styles),
                                t = e.instance.popper,
                                i = e.attributes,
                                Object.keys(i).forEach(function(e) {
                                    !1 === i[e] ? t.removeAttribute(e) : t.setAttribute(e, i[e])
                                }),
                                e.arrowElement && Object.keys(e.arrowStyles).length && c(e.arrowElement, e.arrowStyles),
                                e;
                            var t, i
                        },
                        onLoad: function(e, t, i, n, o) {
                            var r = l(o, t, e, i.positionFixed),
                                s = a(i.placement, r, t, e, i.modifiers.flip.boundariesElement, i.modifiers.flip.padding);
                            return t.setAttribute("x-placement", s),
                                c(t, {
                                    position: i.positionFixed ? "fixed" : "absolute"
                                }),
                                i
                        },
                        gpuAcceleration: void 0
                    }
                }
            },
            J
    }),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], t) : t(e.bootstrap = {}, e.jQuery, e.Popper)
}(this,
    function(e, t, d) {
        "use strict";

        function n(e, t) {
            for (var i = 0; i < t.length; i++) {
                var n = t[i];
                n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value" in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
            }
        }

        function s(e, t, i) {
            return t && n(e.prototype, t),
                i && n(e, i),
                e
        }

        function l(o) {
            for (var e = 1; e < arguments.length; e++) {
                var r = null != arguments[e] ? arguments[e] : {},
                    t = Object.keys(r);
                "function" == typeof Object.getOwnPropertySymbols && (t = t.concat(Object.getOwnPropertySymbols(r).filter(function(e) {
                        return Object.getOwnPropertyDescriptor(r, e).enumerable
                    }))),
                    t.forEach(function(e) {
                        var t, i, n;
                        t = o,
                            n = r[i = e],
                            i in t ? Object.defineProperty(t, i, {
                                value: n,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }) : t[i] = n
                    })
            }
            return o
        }
        t = t && t.hasOwnProperty("default") ? t.default : t,
            d = d && d.hasOwnProperty("default") ? d.default : d;
        var o, i, r, a, c, u, f, p, h, g, v, m, y, b, w, x, _, k, T, S, E, C, A, O, D, N, L, I, j, $, M, P, H, q, W, R, F, z, B, U, V, Y, X, Q, K, G, Z, J, ee, te, ie, ne, oe, re, se, ae, le, ce, de, ue, fe, pe, he, ge, ve, me, ye, be, we, xe, _e, ke, Te, Se, Ee, Ce, Ae, Oe, De, Ne, Le, Ie, je, $e, Me, Pe, He, qe, We, Re, Fe, ze, Be, Ue, Ve, Ye, Xe, Qe, Ke, Ge, Ze, Je, et, tt, it, nt, ot, rt, st, at, lt, ct, dt, ut, ft, pt, ht, gt, vt, mt, yt, bt, wt, xt, _t, kt, Tt, St, Et, Ct = (St = "transitionend",
                Et = {
                    TRANSITION_END: "bsTransitionEnd",
                    getUID: function(e) {
                        for (; e += ~~(1e6 * Math.random()),
                            document.getElementById(e);)
                        ;
                        return e
                    },
                    getSelectorFromElement: function(e) {
                        var t = e.getAttribute("data-target");
                        t && "#" !== t || (t = e.getAttribute("href") || "");
                        try {
                            return document.querySelector(t) ? t : null
                        } catch (e) {
                            return null
                        }
                    },
                    getTransitionDurationFromElement: function(e) {
                        if (!e)
                            return 0;
                        var t = Tt(e).css("transition-duration");
                        return parseFloat(t) ? (t = t.split(",")[0],
                            1e3 * parseFloat(t)) : 0
                    },
                    reflow: function(e) {
                        return e.offsetHeight
                    },
                    triggerTransitionEnd: function(e) {
                        Tt(e).trigger(St)
                    },
                    supportsTransitionEnd: function() {
                        return Boolean(St)
                    },
                    isElement: function(e) {
                        return (e[0] || e).nodeType
                    },
                    typeCheckConfig: function(e, t, i) {
                        for (var n in i)
                            if (Object.prototype.hasOwnProperty.call(i, n)) {
                                var o = i[n],
                                    r = t[n],
                                    s = r && Et.isElement(r) ? "element" : (a = r, {}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());
                                if (!new RegExp(o).test(s))
                                    throw new Error(e.toUpperCase() + ': Option "' + n + '" provided type "' + s + '" but expected type "' + o + '".')
                            }
                        var a
                    }
                },
                (Tt = t).fn.emulateTransitionEnd = function(e) {
                    var t = this,
                        i = !1;
                    return Tt(this).one(Et.TRANSITION_END, function() {
                            i = !0
                        }),
                        setTimeout(function() {
                            i || Et.triggerTransitionEnd(t)
                        }, e),
                        this
                },
                Tt.event.special[Et.TRANSITION_END] = {
                    bindType: St,
                    delegateType: St,
                    handle: function(e) {
                        if (Tt(e.target).is(this))
                            return e.handleObj.handler.apply(this, arguments)
                    }
                },
                Et),
            At = (i = "alert",
                a = "." + (r = "bs.alert"),
                c = (o = t).fn[i],
                u = {
                    CLOSE: "close" + a,
                    CLOSED: "closed" + a,
                    CLICK_DATA_API: "click" + a + ".data-api"
                },
                "alert",
                "fade",
                "show",
                f = function() {
                    function n(e) {
                        this._element = e
                    }
                    var e = n.prototype;
                    return e.close = function(e) {
                            var t = this._element;
                            e && (t = this._getRootElement(e)),
                                this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
                        },
                        e.dispose = function() {
                            o.removeData(this._element, r),
                                this._element = null
                        },
                        e._getRootElement = function(e) {
                            var t = Ct.getSelectorFromElement(e),
                                i = !1;
                            return t && (i = document.querySelector(t)),
                                i || (i = o(e).closest(".alert")[0]),
                                i
                        },
                        e._triggerCloseEvent = function(e) {
                            var t = o.Event(u.CLOSE);
                            return o(e).trigger(t),
                                t
                        },
                        e._removeElement = function(t) {
                            var i = this;
                            if (o(t).removeClass("show"),
                                o(t).hasClass("fade")) {
                                var e = Ct.getTransitionDurationFromElement(t);
                                o(t).one(Ct.TRANSITION_END, function(e) {
                                    return i._destroyElement(t, e)
                                }).emulateTransitionEnd(e)
                            } else
                                this._destroyElement(t)
                        },
                        e._destroyElement = function(e) {
                            o(e).detach().trigger(u.CLOSED).remove()
                        },
                        n._jQueryInterface = function(i) {
                            return this.each(function() {
                                var e = o(this),
                                    t = e.data(r);
                                t || (t = new n(this),
                                        e.data(r, t)),
                                    "close" === i && t[i](this)
                            })
                        },
                        n._handleDismiss = function(t) {
                            return function(e) {
                                e && e.preventDefault(),
                                    t.close(this)
                            }
                        },
                        s(n, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }]),
                        n
                }(),
                o(document).on(u.CLICK_DATA_API, '[data-dismiss="alert"]', f._handleDismiss(new f)),
                o.fn[i] = f._jQueryInterface,
                o.fn[i].Constructor = f,
                o.fn[i].noConflict = function() {
                    return o.fn[i] = c,
                        f._jQueryInterface
                },
                f),
            Ot = (h = "button",
                v = "." + (g = "bs.button"),
                m = ".data-api",
                y = (p = t).fn[h],
                b = "active",
                "btn",
                w = '[data-toggle^="button"]',
                '[data-toggle="buttons"]',
                "input",
                ".active",
                ".btn",
                x = {
                    CLICK_DATA_API: "click" + v + m,
                    FOCUS_BLUR_DATA_API: "focus" + v + m + " blur" + v + m
                },
                _ = function() {
                    function i(e) {
                        this._element = e
                    }
                    var e = i.prototype;
                    return e.toggle = function() {
                            var e = !0,
                                t = !0,
                                i = p(this._element).closest('[data-toggle="buttons"]')[0];
                            if (i) {
                                var n = this._element.querySelector("input");
                                if (n) {
                                    if ("radio" === n.type)
                                        if (n.checked && this._element.classList.contains(b))
                                            e = !1;
                                        else {
                                            var o = i.querySelector(".active");
                                            o && p(o).removeClass(b)
                                        }
                                    if (e) {
                                        if (n.hasAttribute("disabled") || i.hasAttribute("disabled") || n.classList.contains("disabled") || i.classList.contains("disabled"))
                                            return;
                                        n.checked = !this._element.classList.contains(b),
                                            p(n).trigger("change")
                                    }
                                    n.focus(),
                                        t = !1
                                }
                            }
                            t && this._element.setAttribute("aria-pressed", !this._element.classList.contains(b)),
                                e && p(this._element).toggleClass(b)
                        },
                        e.dispose = function() {
                            p.removeData(this._element, g),
                                this._element = null
                        },
                        i._jQueryInterface = function(t) {
                            return this.each(function() {
                                var e = p(this).data(g);
                                e || (e = new i(this),
                                        p(this).data(g, e)),
                                    "toggle" === t && e[t]()
                            })
                        },
                        s(i, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }]),
                        i
                }(),
                p(document).on(x.CLICK_DATA_API, w, function(e) {
                    e.preventDefault();
                    var t = e.target;
                    p(t).hasClass("btn") || (t = p(t).closest(".btn")),
                        _._jQueryInterface.call(p(t), "toggle")
                }).on(x.FOCUS_BLUR_DATA_API, w, function(e) {
                    var t = p(e.target).closest(".btn")[0];
                    p(t).toggleClass("focus", /^focus(in)?$/.test(e.type))
                }),
                p.fn[h] = _._jQueryInterface,
                p.fn[h].Constructor = _,
                p.fn[h].noConflict = function() {
                    return p.fn[h] = y,
                        _._jQueryInterface
                },
                _),
            Dt = (T = "carousel",
                E = "." + (S = "bs.carousel"),
                C = ".data-api",
                A = (k = t).fn[T],
                O = {
                    interval: 5e3,
                    keyboard: !0,
                    slide: !1,
                    pause: "hover",
                    wrap: !0
                },
                D = {
                    interval: "(number|boolean)",
                    keyboard: "boolean",
                    slide: "(boolean|string)",
                    pause: "(string|boolean)",
                    wrap: "boolean"
                },
                N = "next",
                L = "prev",
                "left",
                "right",
                I = {
                    SLIDE: "slide" + E,
                    SLID: "slid" + E,
                    KEYDOWN: "keydown" + E,
                    MOUSEENTER: "mouseenter" + E,
                    MOUSELEAVE: "mouseleave" + E,
                    TOUCHEND: "touchend" + E,
                    LOAD_DATA_API: "load" + E + C,
                    CLICK_DATA_API: "click" + E + C
                },
                "carousel",
                j = "active",
                "slide",
                "carousel-item-right",
                "carousel-item-left",
                "carousel-item-next",
                "carousel-item-prev",
                ".active",
                $ = ".active.carousel-item",
                ".carousel-item",
                ".carousel-item-next, .carousel-item-prev",
                ".carousel-indicators",
                "[data-slide], [data-slide-to]",
                '[data-ride="carousel"]',
                M = function() {
                    function r(e, t) {
                        this._items = null,
                            this._interval = null,
                            this._activeElement = null,
                            this._isPaused = !1,
                            this._isSliding = !1,
                            this.touchTimeout = null,
                            this._config = this._getConfig(t),
                            this._element = k(e)[0],
                            this._indicatorsElement = this._element.querySelector(".carousel-indicators"),
                            this._addEventListeners()
                    }
                    var e = r.prototype;
                    return e.next = function() {
                            this._isSliding || this._slide(N)
                        },
                        e.nextWhenVisible = function() {
                            !document.hidden && k(this._element).is(":visible") && "hidden" !== k(this._element).css("visibility") && this.next()
                        },
                        e.prev = function() {
                            this._isSliding || this._slide(L)
                        },
                        e.pause = function(e) {
                            e || (this._isPaused = !0),
                                this._element.querySelector(".carousel-item-next, .carousel-item-prev") && (Ct.triggerTransitionEnd(this._element),
                                    this.cycle(!0)),
                                clearInterval(this._interval),
                                this._interval = null
                        },
                        e.cycle = function(e) {
                            e || (this._isPaused = !1),
                                this._interval && (clearInterval(this._interval),
                                    this._interval = null),
                                this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
                        },
                        e.to = function(e) {
                            var t = this;
                            this._activeElement = this._element.querySelector($);
                            var i = this._getItemIndex(this._activeElement);
                            if (!(e > this._items.length - 1 || e < 0))
                                if (this._isSliding)
                                    k(this._element).one(I.SLID, function() {
                                        return t.to(e)
                                    });
                                else {
                                    if (i === e)
                                        return this.pause(),
                                            void this.cycle();
                                    var n = i < e ? N : L;
                                    this._slide(n, this._items[e])
                                }
                        },
                        e.dispose = function() {
                            k(this._element).off(E),
                                k.removeData(this._element, S),
                                this._items = null,
                                this._config = null,
                                this._element = null,
                                this._interval = null,
                                this._isPaused = null,
                                this._isSliding = null,
                                this._activeElement = null,
                                this._indicatorsElement = null
                        },
                        e._getConfig = function(e) {
                            return e = l({}, O, e),
                                Ct.typeCheckConfig(T, e, D),
                                e
                        },
                        e._addEventListeners = function() {
                            var t = this;
                            this._config.keyboard && k(this._element).on(I.KEYDOWN, function(e) {
                                    return t._keydown(e)
                                }),
                                "hover" === this._config.pause && (k(this._element).on(I.MOUSEENTER, function(e) {
                                        return t.pause(e)
                                    }).on(I.MOUSELEAVE, function(e) {
                                        return t.cycle(e)
                                    }),
                                    "ontouchstart" in document.documentElement && k(this._element).on(I.TOUCHEND, function() {
                                        t.pause(),
                                            t.touchTimeout && clearTimeout(t.touchTimeout),
                                            t.touchTimeout = setTimeout(function(e) {
                                                return t.cycle(e)
                                            }, 500 + t._config.interval)
                                    }))
                        },
                        e._keydown = function(e) {
                            if (!/input|textarea/i.test(e.target.tagName))
                                switch (e.which) {
                                    case 37:
                                        e.preventDefault(),
                                            this.prev();
                                        break;
                                    case 39:
                                        e.preventDefault(),
                                            this.next()
                                }
                        },
                        e._getItemIndex = function(e) {
                            return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll(".carousel-item")) : [],
                                this._items.indexOf(e)
                        },
                        e._getItemByDirection = function(e, t) {
                            var i = e === N,
                                n = e === L,
                                o = this._getItemIndex(t),
                                r = this._items.length - 1;
                            if ((n && 0 === o || i && o === r) && !this._config.wrap)
                                return t;
                            var s = (o + (e === L ? -1 : 1)) % this._items.length;
                            return -1 === s ? this._items[this._items.length - 1] : this._items[s]
                        },
                        e._triggerSlideEvent = function(e, t) {
                            var i = this._getItemIndex(e),
                                n = this._getItemIndex(this._element.querySelector($)),
                                o = k.Event(I.SLIDE, {
                                    relatedTarget: e,
                                    direction: t,
                                    from: n,
                                    to: i
                                });
                            return k(this._element).trigger(o),
                                o
                        },
                        e._setActiveIndicatorElement = function(e) {
                            if (this._indicatorsElement) {
                                var t = [].slice.call(this._indicatorsElement.querySelectorAll(".active"));
                                k(t).removeClass(j);
                                var i = this._indicatorsElement.children[this._getItemIndex(e)];
                                i && k(i).addClass(j)
                            }
                        },
                        e._slide = function(e, t) {
                            var i, n, o, r = this,
                                s = this._element.querySelector($),
                                a = this._getItemIndex(s),
                                l = t || s && this._getItemByDirection(e, s),
                                c = this._getItemIndex(l),
                                d = Boolean(this._interval);
                            if (o = e === N ? (i = "carousel-item-left",
                                    n = "carousel-item-next",
                                    "left") : (i = "carousel-item-right",
                                    n = "carousel-item-prev",
                                    "right"),
                                l && k(l).hasClass(j))
                                this._isSliding = !1;
                            else if (!this._triggerSlideEvent(l, o).isDefaultPrevented() && s && l) {
                                this._isSliding = !0,
                                    d && this.pause(),
                                    this._setActiveIndicatorElement(l);
                                var u = k.Event(I.SLID, {
                                    relatedTarget: l,
                                    direction: o,
                                    from: a,
                                    to: c
                                });
                                if (k(this._element).hasClass("slide")) {
                                    k(l).addClass(n),
                                        Ct.reflow(l),
                                        k(s).addClass(i),
                                        k(l).addClass(i);
                                    var f = Ct.getTransitionDurationFromElement(s);
                                    k(s).one(Ct.TRANSITION_END, function() {
                                        k(l).removeClass(i + " " + n).addClass(j),
                                            k(s).removeClass(j + " " + n + " " + i),
                                            r._isSliding = !1,
                                            setTimeout(function() {
                                                return k(r._element).trigger(u)
                                            }, 0)
                                    }).emulateTransitionEnd(f)
                                } else
                                    k(s).removeClass(j),
                                    k(l).addClass(j),
                                    this._isSliding = !1,
                                    k(this._element).trigger(u);
                                d && this.cycle()
                            }
                        },
                        r._jQueryInterface = function(n) {
                            return this.each(function() {
                                var e = k(this).data(S),
                                    t = l({}, O, k(this).data());
                                "object" == typeof n && (t = l({}, t, n));
                                var i = "string" == typeof n ? n : t.slide;
                                if (e || (e = new r(this, t),
                                        k(this).data(S, e)),
                                    "number" == typeof n)
                                    e.to(n);
                                else if ("string" == typeof i) {
                                    if (void 0 === e[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    e[i]()
                                } else
                                    t.interval && (e.pause(),
                                        e.cycle())
                            })
                        },
                        r._dataApiClickHandler = function(e) {
                            var t = Ct.getSelectorFromElement(this);
                            if (t) {
                                var i = k(t)[0];
                                if (i && k(i).hasClass("carousel")) {
                                    var n = l({}, k(i).data(), k(this).data()),
                                        o = this.getAttribute("data-slide-to");
                                    o && (n.interval = !1),
                                        r._jQueryInterface.call(k(i), n),
                                        o && k(i).data(S).to(o),
                                        e.preventDefault()
                                }
                            }
                        },
                        s(r, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return O
                            }
                        }]),
                        r
                }(),
                k(document).on(I.CLICK_DATA_API, "[data-slide], [data-slide-to]", M._dataApiClickHandler),
                k(window).on(I.LOAD_DATA_API, function() {
                    for (var e = [].slice.call(document.querySelectorAll('[data-ride="carousel"]')), t = 0, i = e.length; t < i; t++) {
                        var n = k(e[t]);
                        M._jQueryInterface.call(n, n.data())
                    }
                }),
                k.fn[T] = M._jQueryInterface,
                k.fn[T].Constructor = M,
                k.fn[T].noConflict = function() {
                    return k.fn[T] = A,
                        M._jQueryInterface
                },
                M),
            Nt = (H = "collapse",
                W = "." + (q = "bs.collapse"),
                R = (P = t).fn[H],
                F = {
                    toggle: !0,
                    parent: ""
                },
                z = {
                    toggle: "boolean",
                    parent: "(string|element)"
                },
                B = {
                    SHOW: "show" + W,
                    SHOWN: "shown" + W,
                    HIDE: "hide" + W,
                    HIDDEN: "hidden" + W,
                    CLICK_DATA_API: "click" + W + ".data-api"
                },
                U = "show",
                V = "collapse",
                Y = "collapsing",
                X = "collapsed",
                "width",
                "height",
                ".show, .collapsing",
                Q = '[data-toggle="collapse"]',
                K = function() {
                    function a(t, e) {
                        this._isTransitioning = !1,
                            this._element = t,
                            this._config = this._getConfig(e),
                            this._triggerArray = P.makeArray(document.querySelectorAll('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'));
                        for (var i = [].slice.call(document.querySelectorAll(Q)), n = 0, o = i.length; n < o; n++) {
                            var r = i[n],
                                s = Ct.getSelectorFromElement(r),
                                a = [].slice.call(document.querySelectorAll(s)).filter(function(e) {
                                    return e === t
                                });
                            null !== s && 0 < a.length && (this._selector = s,
                                this._triggerArray.push(r))
                        }
                        this._parent = this._config.parent ? this._getParent() : null,
                            this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray),
                            this._config.toggle && this.toggle()
                    }
                    var e = a.prototype;
                    return e.toggle = function() {
                            P(this._element).hasClass(U) ? this.hide() : this.show()
                        },
                        e.show = function() {
                            var e, t, i = this;
                            if (!(this._isTransitioning || P(this._element).hasClass(U) || (this._parent && 0 === (e = [].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter(function(e) {
                                        return e.getAttribute("data-parent") === i._config.parent
                                    })).length && (e = null),
                                    e && (t = P(e).not(this._selector).data(q)) && t._isTransitioning))) {
                                var n = P.Event(B.SHOW);
                                if (P(this._element).trigger(n), !n.isDefaultPrevented()) {
                                    e && (a._jQueryInterface.call(P(e).not(this._selector), "hide"),
                                        t || P(e).data(q, null));
                                    var o = this._getDimension();
                                    P(this._element).removeClass(V).addClass(Y),
                                        this._element.style[o] = 0,
                                        this._triggerArray.length && P(this._triggerArray).removeClass(X).attr("aria-expanded", !0),
                                        this.setTransitioning(!0);
                                    var r = "scroll" + (o[0].toUpperCase() + o.slice(1)),
                                        s = Ct.getTransitionDurationFromElement(this._element);
                                    P(this._element).one(Ct.TRANSITION_END, function() {
                                            P(i._element).removeClass(Y).addClass(V).addClass(U),
                                                i._element.style[o] = "",
                                                i.setTransitioning(!1),
                                                P(i._element).trigger(B.SHOWN)
                                        }).emulateTransitionEnd(s),
                                        this._element.style[o] = this._element[r] + "px"
                                }
                            }
                        },
                        e.hide = function() {
                            var e = this;
                            if (!this._isTransitioning && P(this._element).hasClass(U)) {
                                var t = P.Event(B.HIDE);
                                if (P(this._element).trigger(t), !t.isDefaultPrevented()) {
                                    var i = this._getDimension();
                                    this._element.style[i] = this._element.getBoundingClientRect()[i] + "px",
                                        Ct.reflow(this._element),
                                        P(this._element).addClass(Y).removeClass(V).removeClass(U);
                                    var n = this._triggerArray.length;
                                    if (0 < n)
                                        for (var o = 0; o < n; o++) {
                                            var r = this._triggerArray[o],
                                                s = Ct.getSelectorFromElement(r);
                                            null !== s && (P([].slice.call(document.querySelectorAll(s))).hasClass(U) || P(r).addClass(X).attr("aria-expanded", !1))
                                        }
                                    this.setTransitioning(!0),
                                        this._element.style[i] = "";
                                    var a = Ct.getTransitionDurationFromElement(this._element);
                                    P(this._element).one(Ct.TRANSITION_END, function() {
                                        e.setTransitioning(!1),
                                            P(e._element).removeClass(Y).addClass(V).trigger(B.HIDDEN)
                                    }).emulateTransitionEnd(a)
                                }
                            }
                        },
                        e.setTransitioning = function(e) {
                            this._isTransitioning = e
                        },
                        e.dispose = function() {
                            P.removeData(this._element, q),
                                this._config = null,
                                this._parent = null,
                                this._element = null,
                                this._triggerArray = null,
                                this._isTransitioning = null
                        },
                        e._getConfig = function(e) {
                            return (e = l({}, F, e)).toggle = Boolean(e.toggle),
                                Ct.typeCheckConfig(H, e, z),
                                e
                        },
                        e._getDimension = function() {
                            return P(this._element).hasClass("width") ? "width" : "height"
                        },
                        e._getParent = function() {
                            var i = this,
                                e = null;
                            Ct.isElement(this._config.parent) ? (e = this._config.parent,
                                void 0 !== this._config.parent.jquery && (e = this._config.parent[0])) : e = document.querySelector(this._config.parent);
                            var t = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
                                n = [].slice.call(e.querySelectorAll(t));
                            return P(n).each(function(e, t) {
                                    i._addAriaAndCollapsedClass(a._getTargetFromElement(t), [t])
                                }),
                                e
                        },
                        e._addAriaAndCollapsedClass = function(e, t) {
                            if (e) {
                                var i = P(e).hasClass(U);
                                t.length && P(t).toggleClass(X, !i).attr("aria-expanded", i)
                            }
                        },
                        a._getTargetFromElement = function(e) {
                            var t = Ct.getSelectorFromElement(e);
                            return t ? document.querySelector(t) : null
                        },
                        a._jQueryInterface = function(n) {
                            return this.each(function() {
                                var e = P(this),
                                    t = e.data(q),
                                    i = l({}, F, e.data(), "object" == typeof n && n ? n : {});
                                if (!t && i.toggle && /show|hide/.test(n) && (i.toggle = !1),
                                    t || (t = new a(this, i),
                                        e.data(q, t)),
                                    "string" == typeof n) {
                                    if (void 0 === t[n])
                                        throw new TypeError('No method named "' + n + '"');
                                    t[n]()
                                }
                            })
                        },
                        s(a, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return F
                            }
                        }]),
                        a
                }(),
                P(document).on(B.CLICK_DATA_API, Q, function(e) {
                    "A" === e.currentTarget.tagName && e.preventDefault();
                    var i = P(this),
                        t = Ct.getSelectorFromElement(this),
                        n = [].slice.call(document.querySelectorAll(t));
                    P(n).each(function() {
                        var e = P(this),
                            t = e.data(q) ? "toggle" : i.data();
                        K._jQueryInterface.call(e, t)
                    })
                }),
                P.fn[H] = K._jQueryInterface,
                P.fn[H].Constructor = K,
                P.fn[H].noConflict = function() {
                    return P.fn[H] = R,
                        K._jQueryInterface
                },
                K),
            Lt = (Z = "dropdown",
                ee = "." + (J = "bs.dropdown"),
                te = ".data-api",
                ie = (G = t).fn[Z],
                ne = new RegExp("38|40|27"),
                oe = {
                    HIDE: "hide" + ee,
                    HIDDEN: "hidden" + ee,
                    SHOW: "show" + ee,
                    SHOWN: "shown" + ee,
                    CLICK: "click" + ee,
                    CLICK_DATA_API: "click" + ee + te,
                    KEYDOWN_DATA_API: "keydown" + ee + te,
                    KEYUP_DATA_API: "keyup" + ee + te
                },
                re = "disabled",
                se = "show",
                "dropup",
                "dropright",
                "dropleft",
                ae = "dropdown-menu-right",
                "position-static",
                le = '[data-toggle="dropdown"]',
                ".dropdown form",
                ce = ".dropdown-menu",
                ".navbar-nav",
                ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
                "top-start",
                "top-end",
                "bottom-start",
                "bottom-end",
                "right-start",
                "left-start",
                de = {
                    offset: 0,
                    flip: !0,
                    boundary: "scrollParent",
                    reference: "toggle",
                    display: "dynamic"
                },
                ue = {
                    offset: "(number|string|function)",
                    flip: "boolean",
                    boundary: "(string|element)",
                    reference: "(string|element)",
                    display: "string"
                },
                fe = function() {
                    function c(e, t) {
                        this._element = e,
                            this._popper = null,
                            this._config = this._getConfig(t),
                            this._menu = this._getMenuElement(),
                            this._inNavbar = this._detectNavbar(),
                            this._addEventListeners()
                    }
                    var e = c.prototype;
                    return e.toggle = function() {
                            if (!this._element.disabled && !G(this._element).hasClass(re)) {
                                var e = c._getParentFromElement(this._element),
                                    t = G(this._menu).hasClass(se);
                                if (c._clearMenus(), !t) {
                                    var i = {
                                            relatedTarget: this._element
                                        },
                                        n = G.Event(oe.SHOW, i);
                                    if (G(e).trigger(n), !n.isDefaultPrevented()) {
                                        if (!this._inNavbar) {
                                            if (void 0 === d)
                                                throw new TypeError("Bootstrap dropdown require Popper.js (https://popper.js.org)");
                                            var o = this._element;
                                            "parent" === this._config.reference ? o = e : Ct.isElement(this._config.reference) && (o = this._config.reference,
                                                    void 0 !== this._config.reference.jquery && (o = this._config.reference[0])),
                                                "scrollParent" !== this._config.boundary && G(e).addClass("position-static"),
                                                this._popper = new d(o, this._menu, this._getPopperConfig())
                                        }
                                        "ontouchstart" in document.documentElement && 0 === G(e).closest(".navbar-nav").length && G(document.body).children().on("mouseover", null, G.noop),
                                            this._element.focus(),
                                            this._element.setAttribute("aria-expanded", !0),
                                            G(this._menu).toggleClass(se),
                                            G(e).toggleClass(se).trigger(G.Event(oe.SHOWN, i))
                                    }
                                }
                            }
                        },
                        e.dispose = function() {
                            G.removeData(this._element, J),
                                G(this._element).off(ee),
                                this._element = null,
                                (this._menu = null) !== this._popper && (this._popper.destroy(),
                                    this._popper = null)
                        },
                        e.update = function() {
                            this._inNavbar = this._detectNavbar(),
                                null !== this._popper && this._popper.scheduleUpdate()
                        },
                        e._addEventListeners = function() {
                            var t = this;
                            G(this._element).on(oe.CLICK, function(e) {
                                e.preventDefault(),
                                    e.stopPropagation(),
                                    t.toggle()
                            })
                        },
                        e._getConfig = function(e) {
                            return e = l({}, this.constructor.Default, G(this._element).data(), e),
                                Ct.typeCheckConfig(Z, e, this.constructor.DefaultType),
                                e
                        },
                        e._getMenuElement = function() {
                            if (!this._menu) {
                                var e = c._getParentFromElement(this._element);
                                e && (this._menu = e.querySelector(ce))
                            }
                            return this._menu
                        },
                        e._getPlacement = function() {
                            var e = G(this._element.parentNode),
                                t = "bottom-start";
                            return e.hasClass("dropup") ? (t = "top-start",
                                    G(this._menu).hasClass(ae) && (t = "top-end")) : e.hasClass("dropright") ? t = "right-start" : e.hasClass("dropleft") ? t = "left-start" : G(this._menu).hasClass(ae) && (t = "bottom-end"),
                                t
                        },
                        e._detectNavbar = function() {
                            return 0 < G(this._element).closest(".navbar").length
                        },
                        e._getPopperConfig = function() {
                            var t = this,
                                e = {};
                            "function" == typeof this._config.offset ? e.fn = function(e) {
                                    return e.offsets = l({}, e.offsets, t._config.offset(e.offsets) || {}),
                                        e
                                } :
                                e.offset = this._config.offset;
                            var i = {
                                placement: this._getPlacement(),
                                modifiers: {
                                    offset: e,
                                    flip: {
                                        enabled: this._config.flip
                                    },
                                    preventOverflow: {
                                        boundariesElement: this._config.boundary
                                    }
                                }
                            };
                            return "static" === this._config.display && (i.modifiers.applyStyle = {
                                    enabled: !1
                                }),
                                i
                        },
                        c._jQueryInterface = function(t) {
                            return this.each(function() {
                                var e = G(this).data(J);
                                if (e || (e = new c(this, "object" == typeof t ? t : null),
                                        G(this).data(J, e)),
                                    "string" == typeof t) {
                                    if (void 0 === e[t])
                                        throw new TypeError('No method named "' + t + '"');
                                    e[t]()
                                }
                            })
                        },
                        c._clearMenus = function(e) {
                            if (!e || 3 !== e.which && ("keyup" !== e.type || 9 === e.which))
                                for (var t = [].slice.call(document.querySelectorAll(le)), i = 0, n = t.length; i < n; i++) {
                                    var o = c._getParentFromElement(t[i]),
                                        r = G(t[i]).data(J),
                                        s = {
                                            relatedTarget: t[i]
                                        };
                                    if (e && "click" === e.type && (s.clickEvent = e),
                                        r) {
                                        var a = r._menu;
                                        if (G(o).hasClass(se) && !(e && ("click" === e.type && /input|textarea/i.test(e.target.tagName) || "keyup" === e.type && 9 === e.which) && G.contains(o, e.target))) {
                                            var l = G.Event(oe.HIDE, s);
                                            G(o).trigger(l),
                                                l.isDefaultPrevented() || ("ontouchstart" in document.documentElement && G(document.body).children().off("mouseover", null, G.noop),
                                                    t[i].setAttribute("aria-expanded", "false"),
                                                    G(a).removeClass(se),
                                                    G(o).removeClass(se).trigger(G.Event(oe.HIDDEN, s)))
                                        }
                                    }
                                }
                        },
                        c._getParentFromElement = function(e) {
                            var t, i = Ct.getSelectorFromElement(e);
                            return i && (t = document.querySelector(i)),
                                t || e.parentNode
                        },
                        c._dataApiKeydownHandler = function(e) {
                            if ((/input|textarea/i.test(e.target.tagName) ? !(32 === e.which || 27 !== e.which && (40 !== e.which && 38 !== e.which || G(e.target).closest(ce).length)) : ne.test(e.which)) && (e.preventDefault(),
                                    e.stopPropagation(), !this.disabled && !G(this).hasClass(re))) {
                                var t = c._getParentFromElement(this),
                                    i = G(t).hasClass(se);
                                if ((i || 27 === e.which && 32 === e.which) && (!i || 27 !== e.which && 32 !== e.which)) {
                                    var n = [].slice.call(t.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)"));
                                    if (0 !== n.length) {
                                        var o = n.indexOf(e.target);
                                        38 === e.which && 0 < o && o--,
                                            40 === e.which && o < n.length - 1 && o++,
                                            o < 0 && (o = 0),
                                            n[o].focus()
                                    }
                                } else {
                                    if (27 === e.which) {
                                        var r = t.querySelector(le);
                                        G(r).trigger("focus")
                                    }
                                    G(this).trigger("click")
                                }
                            }
                        },
                        s(c, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return de
                            }
                        }, {
                            key: "DefaultType",
                            get: function() {
                                return ue
                            }
                        }]),
                        c
                }(),
                G(document).on(oe.KEYDOWN_DATA_API, le, fe._dataApiKeydownHandler).on(oe.KEYDOWN_DATA_API, ce, fe._dataApiKeydownHandler).on(oe.CLICK_DATA_API + " " + oe.KEYUP_DATA_API, fe._clearMenus).on(oe.CLICK_DATA_API, le, function(e) {
                    e.preventDefault(),
                        e.stopPropagation(),
                        fe._jQueryInterface.call(G(this), "toggle")
                }).on(oe.CLICK_DATA_API, ".dropdown form", function(e) {
                    e.stopPropagation()
                }),
                G.fn[Z] = fe._jQueryInterface,
                G.fn[Z].Constructor = fe,
                G.fn[Z].noConflict = function() {
                    return G.fn[Z] = ie,
                        fe._jQueryInterface
                },
                fe),
            It = (he = "modal",
                ve = "." + (ge = "bs.modal"),
                me = (pe = t).fn[he],
                ye = {
                    backdrop: !0,
                    keyboard: !0,
                    focus: !0,
                    show: !0
                },
                be = {
                    backdrop: "(boolean|string)",
                    keyboard: "boolean",
                    focus: "boolean",
                    show: "boolean"
                },
                we = {
                    HIDE: "hide" + ve,
                    HIDDEN: "hidden" + ve,
                    SHOW: "show" + ve,
                    SHOWN: "shown" + ve,
                    FOCUSIN: "focusin" + ve,
                    RESIZE: "resize" + ve,
                    CLICK_DISMISS: "click.dismiss" + ve,
                    KEYDOWN_DISMISS: "keydown.dismiss" + ve,
                    MOUSEUP_DISMISS: "mouseup.dismiss" + ve,
                    MOUSEDOWN_DISMISS: "mousedown.dismiss" + ve,
                    CLICK_DATA_API: "click" + ve + ".data-api"
                },
                "modal-scrollbar-measure",
                "modal-backdrop",
                xe = "modal-open",
                _e = "fade",
                ke = "show",
                ".modal-dialog",
                '[data-toggle="modal"]',
                '[data-dismiss="modal"]',
                Te = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
                Se = ".sticky-top",
                Ee = function() {
                    function o(e, t) {
                        this._config = this._getConfig(t),
                            this._element = e,
                            this._dialog = e.querySelector(".modal-dialog"),
                            this._backdrop = null,
                            this._isShown = !1,
                            this._isBodyOverflowing = !1,
                            this._ignoreBackdropClick = !1,
                            this._scrollbarWidth = 0
                    }
                    var e = o.prototype;
                    return e.toggle = function(e) {
                            return this._isShown ? this.hide() : this.show(e)
                        },
                        e.show = function(e) {
                            var t = this;
                            if (!this._isTransitioning && !this._isShown) {
                                pe(this._element).hasClass(_e) && (this._isTransitioning = !0);
                                var i = pe.Event(we.SHOW, {
                                    relatedTarget: e
                                });
                                pe(this._element).trigger(i),
                                    this._isShown || i.isDefaultPrevented() || (this._isShown = !0,
                                        this._checkScrollbar(),
                                        this._setScrollbar(),
                                        this._adjustDialog(),
                                        pe(document.body).addClass(xe),
                                        this._setEscapeEvent(),
                                        this._setResizeEvent(),
                                        pe(this._element).on(we.CLICK_DISMISS, '[data-dismiss="modal"]', function(e) {
                                            return t.hide(e)
                                        }),
                                        pe(this._dialog).on(we.MOUSEDOWN_DISMISS, function() {
                                            pe(t._element).one(we.MOUSEUP_DISMISS, function(e) {
                                                pe(e.target).is(t._element) && (t._ignoreBackdropClick = !0)
                                            })
                                        }),
                                        this._showBackdrop(function() {
                                            return t._showElement(e)
                                        }))
                            }
                        },
                        e.hide = function(e) {
                            var t = this;
                            if (e && e.preventDefault(), !this._isTransitioning && this._isShown) {
                                var i = pe.Event(we.HIDE);
                                if (pe(this._element).trigger(i),
                                    this._isShown && !i.isDefaultPrevented()) {
                                    this._isShown = !1;
                                    var n = pe(this._element).hasClass(_e);
                                    if (n && (this._isTransitioning = !0),
                                        this._setEscapeEvent(),
                                        this._setResizeEvent(),
                                        pe(document).off(we.FOCUSIN),
                                        pe(this._element).removeClass(ke),
                                        pe(this._element).off(we.CLICK_DISMISS),
                                        pe(this._dialog).off(we.MOUSEDOWN_DISMISS),
                                        n) {
                                        var o = Ct.getTransitionDurationFromElement(this._element);
                                        pe(this._element).one(Ct.TRANSITION_END, function(e) {
                                            return t._hideModal(e)
                                        }).emulateTransitionEnd(o)
                                    } else
                                        this._hideModal()
                                }
                            }
                        },
                        e.dispose = function() {
                            pe.removeData(this._element, ge),
                                pe(window, document, this._element, this._backdrop).off(ve),
                                this._config = null,
                                this._element = null,
                                this._dialog = null,
                                this._backdrop = null,
                                this._isShown = null,
                                this._isBodyOverflowing = null,
                                this._ignoreBackdropClick = null,
                                this._scrollbarWidth = null
                        },
                        e.handleUpdate = function() {
                            this._adjustDialog()
                        },
                        e._getConfig = function(e) {
                            return e = l({}, ye, e),
                                Ct.typeCheckConfig(he, e, be),
                                e
                        },
                        e._showElement = function(e) {
                            var t = this,
                                i = pe(this._element).hasClass(_e);
                            this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element),
                                this._element.style.display = "block",
                                this._element.removeAttribute("aria-hidden"),
                                this._element.scrollTop = 0,
                                i && Ct.reflow(this._element),
                                pe(this._element).addClass(ke),
                                this._config.focus && this._enforceFocus();
                            var n = pe.Event(we.SHOWN, {
                                    relatedTarget: e
                                }),
                                o = function() {
                                    t._config.focus && t._element.focus(),
                                        t._isTransitioning = !1,
                                        pe(t._element).trigger(n)
                                };
                            if (i) {
                                var r = Ct.getTransitionDurationFromElement(this._element);
                                pe(this._dialog).one(Ct.TRANSITION_END, o).emulateTransitionEnd(r)
                            } else
                                o()
                        },
                        e._enforceFocus = function() {
                            var t = this;
                            pe(document).off(we.FOCUSIN).on(we.FOCUSIN, function(e) {
                                document !== e.target && t._element !== e.target && 0 === pe(t._element).has(e.target).length && t._element.focus()
                            })
                        },
                        e._setEscapeEvent = function() {
                            var t = this;
                            this._isShown && this._config.keyboard ? pe(this._element).on(we.KEYDOWN_DISMISS, function(e) {
                                27 === e.which && (e.preventDefault(),
                                    t.hide())
                            }) : this._isShown || pe(this._element).off(we.KEYDOWN_DISMISS)
                        },
                        e._setResizeEvent = function() {
                            var t = this;
                            this._isShown ? pe(window).on(we.RESIZE, function(e) {
                                return t.handleUpdate(e)
                            }) : pe(window).off(we.RESIZE)
                        },
                        e._hideModal = function() {
                            var e = this;
                            this._element.style.display = "none",
                                this._element.setAttribute("aria-hidden", !0),
                                this._isTransitioning = !1,
                                this._showBackdrop(function() {
                                    pe(document.body).removeClass(xe),
                                        e._resetAdjustments(),
                                        e._resetScrollbar(),
                                        pe(e._element).trigger(we.HIDDEN)
                                })
                        },
                        e._removeBackdrop = function() {
                            this._backdrop && (pe(this._backdrop).remove(),
                                this._backdrop = null)
                        },
                        e._showBackdrop = function(e) {
                            var t = this,
                                i = pe(this._element).hasClass(_e) ? _e : "";
                            if (this._isShown && this._config.backdrop) {
                                if (this._backdrop = document.createElement("div"),
                                    this._backdrop.className = "modal-backdrop",
                                    i && this._backdrop.classList.add(i),
                                    pe(this._backdrop).appendTo(document.body),
                                    pe(this._element).on(we.CLICK_DISMISS, function(e) {
                                        t._ignoreBackdropClick ? t._ignoreBackdropClick = !1 : e.target === e.currentTarget && ("static" === t._config.backdrop ? t._element.focus() : t.hide())
                                    }),
                                    i && Ct.reflow(this._backdrop),
                                    pe(this._backdrop).addClass(ke), !e)
                                    return;
                                if (!i)
                                    return void e();
                                var n = Ct.getTransitionDurationFromElement(this._backdrop);
                                pe(this._backdrop).one(Ct.TRANSITION_END, e).emulateTransitionEnd(n)
                            } else if (!this._isShown && this._backdrop) {
                                pe(this._backdrop).removeClass(ke);
                                var o = function() {
                                    t._removeBackdrop(),
                                        e && e()
                                };
                                if (pe(this._element).hasClass(_e)) {
                                    var r = Ct.getTransitionDurationFromElement(this._backdrop);
                                    pe(this._backdrop).one(Ct.TRANSITION_END, o).emulateTransitionEnd(r)
                                } else
                                    o()
                            } else
                                e && e()
                        },
                        e._adjustDialog = function() {
                            var e = this._element.scrollHeight > document.documentElement.clientHeight;
                            !this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"),
                                this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
                        },
                        e._resetAdjustments = function() {
                            this._element.style.paddingLeft = "",
                                this._element.style.paddingRight = ""
                        },
                        e._checkScrollbar = function() {
                            var e = document.body.getBoundingClientRect();
                            this._isBodyOverflowing = e.left + e.right < window.innerWidth,
                                this._scrollbarWidth = this._getScrollbarWidth()
                        },
                        e._setScrollbar = function() {
                            var o = this;
                            if (this._isBodyOverflowing) {
                                var e = [].slice.call(document.querySelectorAll(Te)),
                                    t = [].slice.call(document.querySelectorAll(Se));
                                pe(e).each(function(e, t) {
                                        var i = t.style.paddingRight,
                                            n = pe(t).css("padding-right");
                                        pe(t).data("padding-right", i).css("padding-right", parseFloat(n) + o._scrollbarWidth + "px")
                                    }),
                                    pe(t).each(function(e, t) {
                                        var i = t.style.marginRight,
                                            n = pe(t).css("margin-right");
                                        pe(t).data("margin-right", i).css("margin-right", parseFloat(n) - o._scrollbarWidth + "px")
                                    });
                                var i = document.body.style.paddingRight,
                                    n = pe(document.body).css("padding-right");
                                pe(document.body).data("padding-right", i).css("padding-right", parseFloat(n) + this._scrollbarWidth + "px")
                            }
                        },
                        e._resetScrollbar = function() {
                            var e = [].slice.call(document.querySelectorAll(Te));
                            pe(e).each(function(e, t) {
                                var i = pe(t).data("padding-right");
                                pe(t).removeData("padding-right"),
                                    t.style.paddingRight = i || ""
                            });
                            var t = [].slice.call(document.querySelectorAll("" + Se));
                            pe(t).each(function(e, t) {
                                var i = pe(t).data("margin-right");
                                void 0 !== i && pe(t).css("margin-right", i).removeData("margin-right")
                            });
                            var i = pe(document.body).data("padding-right");
                            pe(document.body).removeData("padding-right"),
                                document.body.style.paddingRight = i || ""
                        },
                        e._getScrollbarWidth = function() {
                            var e = document.createElement("div");
                            e.className = "modal-scrollbar-measure",
                                document.body.appendChild(e);
                            var t = e.getBoundingClientRect().width - e.clientWidth;
                            return document.body.removeChild(e),
                                t
                        },
                        o._jQueryInterface = function(i, n) {
                            return this.each(function() {
                                var e = pe(this).data(ge),
                                    t = l({}, ye, pe(this).data(), "object" == typeof i && i ? i : {});
                                if (e || (e = new o(this, t),
                                        pe(this).data(ge, e)),
                                    "string" == typeof i) {
                                    if (void 0 === e[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    e[i](n)
                                } else
                                    t.show && e.show(n)
                            })
                        },
                        s(o, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return ye
                            }
                        }]),
                        o
                }(),
                pe(document).on(we.CLICK_DATA_API, '[data-toggle="modal"]', function(e) {
                    var t, i = this,
                        n = Ct.getSelectorFromElement(this);
                    n && (t = document.querySelector(n));
                    var o = pe(t).data(ge) ? "toggle" : l({}, pe(t).data(), pe(this).data());
                    "A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
                    var r = pe(t).one(we.SHOW, function(e) {
                        e.isDefaultPrevented() || r.one(we.HIDDEN, function() {
                            pe(i).is(":visible") && i.focus()
                        })
                    });
                    Ee._jQueryInterface.call(pe(t), o, this)
                }),
                pe.fn[he] = Ee._jQueryInterface,
                pe.fn[he].Constructor = Ee,
                pe.fn[he].noConflict = function() {
                    return pe.fn[he] = me,
                        Ee._jQueryInterface
                },
                Ee),
            jt = (Ae = "tooltip",
                De = "." + (Oe = "bs.tooltip"),
                Ne = (Ce = t).fn[Ae],
                Le = "bs-tooltip",
                Ie = new RegExp("(^|\\s)" + Le + "\\S+", "g"),
                Me = {
                    animation: !0,
                    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: "hover focus",
                    title: "",
                    delay: 0,
                    html: ($e = {
                        AUTO: "auto",
                        TOP: "top",
                        RIGHT: "right",
                        BOTTOM: "bottom",
                        LEFT: "left"
                    }, !1),
                    selector: (je = {
                        animation: "boolean",
                        template: "string",
                        title: "(string|element|function)",
                        trigger: "string",
                        delay: "(number|object)",
                        html: "boolean",
                        selector: "(string|boolean)",
                        placement: "(string|function)",
                        offset: "(number|string)",
                        container: "(string|element|boolean)",
                        fallbackPlacement: "(string|array)",
                        boundary: "(string|element)"
                    }, !1),
                    placement: "top",
                    offset: 0,
                    container: !1,
                    fallbackPlacement: "flip",
                    boundary: "scrollParent"
                },
                "out",
                He = {
                    HIDE: "hide" + De,
                    HIDDEN: "hidden" + De,
                    SHOW: (Pe = "show") + De,
                    SHOWN: "shown" + De,
                    INSERTED: "inserted" + De,
                    CLICK: "click" + De,
                    FOCUSIN: "focusin" + De,
                    FOCUSOUT: "focusout" + De,
                    MOUSEENTER: "mouseenter" + De,
                    MOUSELEAVE: "mouseleave" + De
                },
                qe = "fade",
                We = "show",
                ".tooltip-inner",
                ".arrow",
                Re = "hover",
                Fe = "focus",
                "click",
                "manual",
                ze = function() {
                    function n(e, t) {
                        if (void 0 === d)
                            throw new TypeError("Bootstrap tooltips require Popper.js (https://popper.js.org)");
                        this._isEnabled = !0,
                            this._timeout = 0,
                            this._hoverState = "",
                            this._activeTrigger = {},
                            this._popper = null,
                            this.element = e,
                            this.config = this._getConfig(t),
                            this.tip = null,
                            this._setListeners()
                    }
                    var e = n.prototype;
                    return e.enable = function() {
                            this._isEnabled = !0
                        },
                        e.disable = function() {
                            this._isEnabled = !1
                        },
                        e.toggleEnabled = function() {
                            this._isEnabled = !this._isEnabled
                        },
                        e.toggle = function(e) {
                            if (this._isEnabled)
                                if (e) {
                                    var t = this.constructor.DATA_KEY,
                                        i = Ce(e.currentTarget).data(t);
                                    i || (i = new this.constructor(e.currentTarget, this._getDelegateConfig()),
                                            Ce(e.currentTarget).data(t, i)),
                                        i._activeTrigger.click = !i._activeTrigger.click,
                                        i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i)
                                } else {
                                    if (Ce(this.getTipElement()).hasClass(We))
                                        return void this._leave(null, this);
                                    this._enter(null, this)
                                }
                        },
                        e.dispose = function() {
                            clearTimeout(this._timeout),
                                Ce.removeData(this.element, this.constructor.DATA_KEY),
                                Ce(this.element).off(this.constructor.EVENT_KEY),
                                Ce(this.element).closest(".modal").off("hide.bs.modal"),
                                this.tip && Ce(this.tip).remove(),
                                this._isEnabled = null,
                                this._timeout = null,
                                this._hoverState = null,
                                (this._activeTrigger = null) !== this._popper && this._popper.destroy(),
                                this._popper = null,
                                this.element = null,
                                this.config = null,
                                this.tip = null
                        },
                        e.show = function() {
                            var t = this;
                            if ("none" === Ce(this.element).css("display"))
                                throw new Error("Please use show on visible elements");
                            var e = Ce.Event(this.constructor.Event.SHOW);
                            if (this.isWithContent() && this._isEnabled) {
                                Ce(this.element).trigger(e);
                                var i = Ce.contains(this.element.ownerDocument.documentElement, this.element);
                                if (e.isDefaultPrevented() || !i)
                                    return;
                                var n = this.getTipElement(),
                                    o = Ct.getUID(this.constructor.NAME);
                                n.setAttribute("id", o),
                                    this.element.setAttribute("aria-describedby", o),
                                    this.setContent(),
                                    this.config.animation && Ce(n).addClass(qe);
                                var r = "function" == typeof this.config.placement ? this.config.placement.call(this, n, this.element) : this.config.placement,
                                    s = this._getAttachment(r);
                                this.addAttachmentClass(s);
                                var a = !1 === this.config.container ? document.body : Ce(document).find(this.config.container);
                                Ce(n).data(this.constructor.DATA_KEY, this),
                                    Ce.contains(this.element.ownerDocument.documentElement, this.tip) || Ce(n).appendTo(a),
                                    Ce(this.element).trigger(this.constructor.Event.INSERTED),
                                    this._popper = new d(this.element, n, {
                                        placement: s,
                                        modifiers: {
                                            offset: {
                                                offset: this.config.offset
                                            },
                                            flip: {
                                                behavior: this.config.fallbackPlacement
                                            },
                                            arrow: {
                                                element: ".arrow"
                                            },
                                            preventOverflow: {
                                                boundariesElement: this.config.boundary
                                            }
                                        },
                                        onCreate: function(e) {
                                            e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
                                        },
                                        onUpdate: function(e) {
                                            t._handlePopperPlacementChange(e)
                                        }
                                    }),
                                    Ce(n).addClass(We),
                                    "ontouchstart" in document.documentElement && Ce(document.body).children().on("mouseover", null, Ce.noop);
                                var l = function() {
                                    t.config.animation && t._fixTransition();
                                    var e = t._hoverState;
                                    t._hoverState = null,
                                        Ce(t.element).trigger(t.constructor.Event.SHOWN),
                                        "out" === e && t._leave(null, t)
                                };
                                if (Ce(this.tip).hasClass(qe)) {
                                    var c = Ct.getTransitionDurationFromElement(this.tip);
                                    Ce(this.tip).one(Ct.TRANSITION_END, l).emulateTransitionEnd(c)
                                } else
                                    l()
                            }
                        },
                        e.hide = function(e) {
                            var t = this,
                                i = this.getTipElement(),
                                n = Ce.Event(this.constructor.Event.HIDE),
                                o = function() {
                                    t._hoverState !== Pe && i.parentNode && i.parentNode.removeChild(i),
                                        t._cleanTipClass(),
                                        t.element.removeAttribute("aria-describedby"),
                                        Ce(t.element).trigger(t.constructor.Event.HIDDEN),
                                        null !== t._popper && t._popper.destroy(),
                                        e && e()
                                };
                            if (Ce(this.element).trigger(n), !n.isDefaultPrevented()) {
                                if (Ce(i).removeClass(We),
                                    "ontouchstart" in document.documentElement && Ce(document.body).children().off("mouseover", null, Ce.noop),
                                    this._activeTrigger.click = !1,
                                    this._activeTrigger[Fe] = !1,
                                    this._activeTrigger[Re] = !1,
                                    Ce(this.tip).hasClass(qe)) {
                                    var r = Ct.getTransitionDurationFromElement(i);
                                    Ce(i).one(Ct.TRANSITION_END, o).emulateTransitionEnd(r)
                                } else
                                    o();
                                this._hoverState = ""
                            }
                        },
                        e.update = function() {
                            null !== this._popper && this._popper.scheduleUpdate()
                        },
                        e.isWithContent = function() {
                            return Boolean(this.getTitle())
                        },
                        e.addAttachmentClass = function(e) {
                            Ce(this.getTipElement()).addClass(Le + "-" + e)
                        },
                        e.getTipElement = function() {
                            return this.tip = this.tip || Ce(this.config.template)[0],
                                this.tip
                        },
                        e.setContent = function() {
                            var e = this.getTipElement();
                            this.setElementContent(Ce(e.querySelectorAll(".tooltip-inner")), this.getTitle()),
                                Ce(e).removeClass(qe + " " + We)
                        },
                        e.setElementContent = function(e, t) {
                            var i = this.config.html;
                            "object" == typeof t && (t.nodeType || t.jquery) ? i ? Ce(t).parent().is(e) || e.empty().append(t) : e.text(Ce(t).text()) : e[i ? "html" : "text"](t)
                        },
                        e.getTitle = function() {
                            var e = this.element.getAttribute("data-original-title");
                            return e || (e = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title),
                                e
                        },
                        e._getAttachment = function(e) {
                            return $e[e.toUpperCase()]
                        },
                        e._setListeners = function() {
                            var n = this;
                            this.config.trigger.split(" ").forEach(function(e) {
                                    if ("click" === e)
                                        Ce(n.element).on(n.constructor.Event.CLICK, n.config.selector, function(e) {
                                            return n.toggle(e)
                                        });
                                    else if ("manual" !== e) {
                                        var t = e === Re ? n.constructor.Event.MOUSEENTER : n.constructor.Event.FOCUSIN,
                                            i = e === Re ? n.constructor.Event.MOUSELEAVE : n.constructor.Event.FOCUSOUT;
                                        Ce(n.element).on(t, n.config.selector, function(e) {
                                            return n._enter(e)
                                        }).on(i, n.config.selector, function(e) {
                                            return n._leave(e)
                                        })
                                    }
                                    Ce(n.element).closest(".modal").on("hide.bs.modal", function() {
                                        return n.hide()
                                    })
                                }),
                                this.config.selector ? this.config = l({}, this.config, {
                                    trigger: "manual",
                                    selector: ""
                                }) : this._fixTitle()
                        },
                        e._fixTitle = function() {
                            var e = typeof this.element.getAttribute("data-original-title");
                            (this.element.getAttribute("title") || "string" !== e) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""),
                                this.element.setAttribute("title", ""))
                        },
                        e._enter = function(e, t) {
                            var i = this.constructor.DATA_KEY;
                            (t = t || Ce(e.currentTarget).data(i)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()),
                                Ce(e.currentTarget).data(i, t)),
                            e && (t._activeTrigger["focusin" === e.type ? Fe : Re] = !0),
                                Ce(t.getTipElement()).hasClass(We) || t._hoverState === Pe ? t._hoverState = Pe : (clearTimeout(t._timeout),
                                    t._hoverState = Pe,
                                    t.config.delay && t.config.delay.show ? t._timeout = setTimeout(function() {
                                        t._hoverState === Pe && t.show()
                                    }, t.config.delay.show) : t.show())
                        },
                        e._leave = function(e, t) {
                            var i = this.constructor.DATA_KEY;
                            (t = t || Ce(e.currentTarget).data(i)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()),
                                Ce(e.currentTarget).data(i, t)),
                            e && (t._activeTrigger["focusout" === e.type ? Fe : Re] = !1),
                                t._isWithActiveTrigger() || (clearTimeout(t._timeout),
                                    t._hoverState = "out",
                                    t.config.delay && t.config.delay.hide ? t._timeout = setTimeout(function() {
                                        "out" === t._hoverState && t.hide()
                                    }, t.config.delay.hide) : t.hide())
                        },
                        e._isWithActiveTrigger = function() {
                            for (var e in this._activeTrigger)
                                if (this._activeTrigger[e])
                                    return !0;
                            return !1
                        },
                        e._getConfig = function(e) {
                            return "number" == typeof(e = l({}, this.constructor.Default, Ce(this.element).data(), "object" == typeof e && e ? e : {})).delay && (e.delay = {
                                    show: e.delay,
                                    hide: e.delay
                                }),
                                "number" == typeof e.title && (e.title = e.title.toString()),
                                "number" == typeof e.content && (e.content = e.content.toString()),
                                Ct.typeCheckConfig(Ae, e, this.constructor.DefaultType),
                                e
                        },
                        e._getDelegateConfig = function() {
                            var e = {};
                            if (this.config)
                                for (var t in this.config)
                                    this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
                            return e
                        },
                        e._cleanTipClass = function() {
                            var e = Ce(this.getTipElement()),
                                t = e.attr("class").match(Ie);
                            null !== t && t.length && e.removeClass(t.join(""))
                        },
                        e._handlePopperPlacementChange = function(e) {
                            var t = e.instance;
                            this.tip = t.popper,
                                this._cleanTipClass(),
                                this.addAttachmentClass(this._getAttachment(e.placement))
                        },
                        e._fixTransition = function() {
                            var e = this.getTipElement(),
                                t = this.config.animation;
                            null === e.getAttribute("x-placement") && (Ce(e).removeClass(qe),
                                this.config.animation = !1,
                                this.hide(),
                                this.show(),
                                this.config.animation = t)
                        },
                        n._jQueryInterface = function(i) {
                            return this.each(function() {
                                var e = Ce(this).data(Oe),
                                    t = "object" == typeof i && i;
                                if ((e || !/dispose|hide/.test(i)) && (e || (e = new n(this, t),
                                            Ce(this).data(Oe, e)),
                                        "string" == typeof i)) {
                                    if (void 0 === e[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    e[i]()
                                }
                            })
                        },
                        s(n, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return Me
                            }
                        }, {
                            key: "NAME",
                            get: function() {
                                return Ae
                            }
                        }, {
                            key: "DATA_KEY",
                            get: function() {
                                return Oe
                            }
                        }, {
                            key: "Event",
                            get: function() {
                                return He
                            }
                        }, {
                            key: "EVENT_KEY",
                            get: function() {
                                return De
                            }
                        }, {
                            key: "DefaultType",
                            get: function() {
                                return je
                            }
                        }]),
                        n
                }(),
                Ce.fn[Ae] = ze._jQueryInterface,
                Ce.fn[Ae].Constructor = ze,
                Ce.fn[Ae].noConflict = function() {
                    return Ce.fn[Ae] = Ne,
                        ze._jQueryInterface
                },
                ze),
            $t = (Ue = "popover",
                Ye = "." + (Ve = "bs.popover"),
                Xe = (Be = t).fn[Ue],
                Qe = "bs-popover",
                Ke = new RegExp("(^|\\s)" + Qe + "\\S+", "g"),
                Ge = l({}, jt.Default, {
                    placement: "right",
                    trigger: "click",
                    content: "",
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
                }),
                Ze = l({}, jt.DefaultType, {
                    content: "(string|element|function)"
                }),
                "fade",
                ".popover-header",
                ".popover-body",
                Je = {
                    HIDE: "hide" + Ye,
                    HIDDEN: "hidden" + Ye,
                    SHOW: "show" + Ye,
                    SHOWN: "shown" + Ye,
                    INSERTED: "inserted" + Ye,
                    CLICK: "click" + Ye,
                    FOCUSIN: "focusin" + Ye,
                    FOCUSOUT: "focusout" + Ye,
                    MOUSEENTER: "mouseenter" + Ye,
                    MOUSELEAVE: "mouseleave" + Ye
                },
                et = function(e) {
                    var t, i;

                    function n() {
                        return e.apply(this, arguments) || this
                    }
                    i = e,
                        (t = n).prototype = Object.create(i.prototype),
                        (t.prototype.constructor = t).__proto__ = i;
                    var o = n.prototype;
                    return o.isWithContent = function() {
                            return this.getTitle() || this._getContent()
                        },
                        o.addAttachmentClass = function(e) {
                            Be(this.getTipElement()).addClass(Qe + "-" + e)
                        },
                        o.getTipElement = function() {
                            return this.tip = this.tip || Be(this.config.template)[0],
                                this.tip
                        },
                        o.setContent = function() {
                            var e = Be(this.getTipElement());
                            this.setElementContent(e.find(".popover-header"), this.getTitle());
                            var t = this._getContent();
                            "function" == typeof t && (t = t.call(this.element)),
                                this.setElementContent(e.find(".popover-body"), t),
                                e.removeClass("fade show")
                        },
                        o._getContent = function() {
                            return this.element.getAttribute("data-content") || this.config.content
                        },
                        o._cleanTipClass = function() {
                            var e = Be(this.getTipElement()),
                                t = e.attr("class").match(Ke);
                            null !== t && 0 < t.length && e.removeClass(t.join(""))
                        },
                        n._jQueryInterface = function(i) {
                            return this.each(function() {
                                var e = Be(this).data(Ve),
                                    t = "object" == typeof i ? i : null;
                                if ((e || !/destroy|hide/.test(i)) && (e || (e = new n(this, t),
                                            Be(this).data(Ve, e)),
                                        "string" == typeof i)) {
                                    if (void 0 === e[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    e[i]()
                                }
                            })
                        },
                        s(n, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return Ge
                            }
                        }, {
                            key: "NAME",
                            get: function() {
                                return Ue
                            }
                        }, {
                            key: "DATA_KEY",
                            get: function() {
                                return Ve
                            }
                        }, {
                            key: "Event",
                            get: function() {
                                return Je
                            }
                        }, {
                            key: "EVENT_KEY",
                            get: function() {
                                return Ye
                            }
                        }, {
                            key: "DefaultType",
                            get: function() {
                                return Ze
                            }
                        }]),
                        n
                }(jt),
                Be.fn[Ue] = et._jQueryInterface,
                Be.fn[Ue].Constructor = et,
                Be.fn[Ue].noConflict = function() {
                    return Be.fn[Ue] = Xe,
                        et._jQueryInterface
                },
                et),
            Mt = (it = "scrollspy",
                ot = "." + (nt = "bs.scrollspy"),
                rt = (tt = t).fn[it],
                st = {
                    offset: 10,
                    method: "auto",
                    target: ""
                },
                at = {
                    offset: "number",
                    method: "string",
                    target: "(string|element)"
                },
                lt = {
                    ACTIVATE: "activate" + ot,
                    SCROLL: "scroll" + ot,
                    LOAD_DATA_API: "load" + ot + ".data-api"
                },
                "dropdown-item",
                ct = "active",
                '[data-spy="scroll"]',
                ".active",
                dt = ".nav, .list-group",
                ut = ".nav-link",
                ".nav-item",
                ft = ".list-group-item",
                ".dropdown",
                ".dropdown-item",
                ".dropdown-toggle",
                "offset",
                pt = "position",
                ht = function() {
                    function i(e, t) {
                        var i = this;
                        this._element = e,
                            this._scrollElement = "BODY" === e.tagName ? window : e,
                            this._config = this._getConfig(t),
                            this._selector = this._config.target + " " + ut + "," + this._config.target + " " + ft + "," + this._config.target + " .dropdown-item",
                            this._offsets = [],
                            this._targets = [],
                            this._activeTarget = null,
                            this._scrollHeight = 0,
                            tt(this._scrollElement).on(lt.SCROLL, function(e) {
                                return i._process(e)
                            }),
                            this.refresh(),
                            this._process()
                    }
                    var e = i.prototype;
                    return e.refresh = function() {
                            var t = this,
                                e = this._scrollElement === this._scrollElement.window ? "offset" : pt,
                                o = "auto" === this._config.method ? e : this._config.method,
                                r = o === pt ? this._getScrollTop() : 0;
                            this._offsets = [],
                                this._targets = [],
                                this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function(e) {
                                    var t, i = Ct.getSelectorFromElement(e);
                                    if (i && (t = document.querySelector(i)),
                                        t) {
                                        var n = t.getBoundingClientRect();
                                        if (n.width || n.height)
                                            return [tt(t)[o]().top + r, i]
                                    }
                                    return null
                                }).filter(function(e) {
                                    return e
                                }).sort(function(e, t) {
                                    return e[0] - t[0]
                                }).forEach(function(e) {
                                    t._offsets.push(e[0]),
                                        t._targets.push(e[1])
                                })
                        },
                        e.dispose = function() {
                            tt.removeData(this._element, nt),
                                tt(this._scrollElement).off(ot),
                                this._element = null,
                                this._scrollElement = null,
                                this._config = null,
                                this._selector = null,
                                this._offsets = null,
                                this._targets = null,
                                this._activeTarget = null,
                                this._scrollHeight = null
                        },
                        e._getConfig = function(e) {
                            if ("string" != typeof(e = l({}, st, "object" == typeof e && e ? e : {})).target) {
                                var t = tt(e.target).attr("id");
                                t || (t = Ct.getUID(it),
                                        tt(e.target).attr("id", t)),
                                    e.target = "#" + t
                            }
                            return Ct.typeCheckConfig(it, e, at),
                                e
                        },
                        e._getScrollTop = function() {
                            return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
                        },
                        e._getScrollHeight = function() {
                            return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                        },
                        e._getOffsetHeight = function() {
                            return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
                        },
                        e._process = function() {
                            var e = this._getScrollTop() + this._config.offset,
                                t = this._getScrollHeight(),
                                i = this._config.offset + t - this._getOffsetHeight();
                            if (this._scrollHeight !== t && this.refresh(),
                                i <= e) {
                                var n = this._targets[this._targets.length - 1];
                                this._activeTarget !== n && this._activate(n)
                            } else {
                                if (this._activeTarget && e < this._offsets[0] && 0 < this._offsets[0])
                                    return this._activeTarget = null,
                                        void this._clear();
                                for (var o = this._offsets.length; o--;)
                                    this._activeTarget !== this._targets[o] && e >= this._offsets[o] && (void 0 === this._offsets[o + 1] || e < this._offsets[o + 1]) && this._activate(this._targets[o])
                            }
                        },
                        e._activate = function(t) {
                            this._activeTarget = t,
                                this._clear();
                            var e = this._selector.split(",");
                            e = e.map(function(e) {
                                return e + '[data-target="' + t + '"],' + e + '[href="' + t + '"]'
                            });
                            var i = tt([].slice.call(document.querySelectorAll(e.join(","))));
                            i.hasClass("dropdown-item") ? (i.closest(".dropdown").find(".dropdown-toggle").addClass(ct),
                                    i.addClass(ct)) : (i.addClass(ct),
                                    i.parents(dt).prev(ut + ", " + ft).addClass(ct),
                                    i.parents(dt).prev(".nav-item").children(ut).addClass(ct)),
                                tt(this._scrollElement).trigger(lt.ACTIVATE, {
                                    relatedTarget: t
                                })
                        },
                        e._clear = function() {
                            var e = [].slice.call(document.querySelectorAll(this._selector));
                            tt(e).filter(".active").removeClass(ct)
                        },
                        i._jQueryInterface = function(t) {
                            return this.each(function() {
                                var e = tt(this).data(nt);
                                if (e || (e = new i(this, "object" == typeof t && t),
                                        tt(this).data(nt, e)),
                                    "string" == typeof t) {
                                    if (void 0 === e[t])
                                        throw new TypeError('No method named "' + t + '"');
                                    e[t]()
                                }
                            })
                        },
                        s(i, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }, {
                            key: "Default",
                            get: function() {
                                return st
                            }
                        }]),
                        i
                }(),
                tt(window).on(lt.LOAD_DATA_API, function() {
                    for (var e = [].slice.call(document.querySelectorAll('[data-spy="scroll"]')), t = e.length; t--;) {
                        var i = tt(e[t]);
                        ht._jQueryInterface.call(i, i.data())
                    }
                }),
                tt.fn[it] = ht._jQueryInterface,
                tt.fn[it].Constructor = ht,
                tt.fn[it].noConflict = function() {
                    return tt.fn[it] = rt,
                        ht._jQueryInterface
                },
                ht),
            Pt = (mt = "." + (vt = "bs.tab"),
                yt = (gt = t).fn.tab,
                bt = {
                    HIDE: "hide" + mt,
                    HIDDEN: "hidden" + mt,
                    SHOW: "show" + mt,
                    SHOWN: "shown" + mt,
                    CLICK_DATA_API: "click" + mt + ".data-api"
                },
                "dropdown-menu",
                wt = "active",
                "disabled",
                "fade",
                "show",
                ".dropdown",
                ".nav, .list-group",
                xt = ".active",
                _t = "> li > .active",
                '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
                ".dropdown-toggle",
                "> .dropdown-menu .active",
                kt = function() {
                    function n(e) {
                        this._element = e
                    }
                    var e = n.prototype;
                    return e.show = function() {
                            var i = this;
                            if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && gt(this._element).hasClass(wt) || gt(this._element).hasClass("disabled"))) {
                                var e, n, t = gt(this._element).closest(".nav, .list-group")[0],
                                    o = Ct.getSelectorFromElement(this._element);
                                if (t) {
                                    var r = "UL" === t.nodeName ? _t : xt;
                                    n = (n = gt.makeArray(gt(t).find(r)))[n.length - 1]
                                }
                                var s = gt.Event(bt.HIDE, {
                                        relatedTarget: this._element
                                    }),
                                    a = gt.Event(bt.SHOW, {
                                        relatedTarget: n
                                    });
                                if (n && gt(n).trigger(s),
                                    gt(this._element).trigger(a), !a.isDefaultPrevented() && !s.isDefaultPrevented()) {
                                    o && (e = document.querySelector(o)),
                                        this._activate(this._element, t);
                                    var l = function() {
                                        var e = gt.Event(bt.HIDDEN, {
                                                relatedTarget: i._element
                                            }),
                                            t = gt.Event(bt.SHOWN, {
                                                relatedTarget: n
                                            });
                                        gt(n).trigger(e),
                                            gt(i._element).trigger(t)
                                    };
                                    e ? this._activate(e, e.parentNode, l) : l()
                                }
                            }
                        },
                        e.dispose = function() {
                            gt.removeData(this._element, vt),
                                this._element = null
                        },
                        e._activate = function(e, t, i) {
                            var n = this,
                                o = ("UL" === t.nodeName ? gt(t).find(_t) : gt(t).children(xt))[0],
                                r = i && o && gt(o).hasClass("fade"),
                                s = function() {
                                    return n._transitionComplete(e, o, i)
                                };
                            if (o && r) {
                                var a = Ct.getTransitionDurationFromElement(o);
                                gt(o).one(Ct.TRANSITION_END, s).emulateTransitionEnd(a)
                            } else
                                s()
                        },
                        e._transitionComplete = function(e, t, i) {
                            if (t) {
                                gt(t).removeClass("show " + wt);
                                var n = gt(t.parentNode).find("> .dropdown-menu .active")[0];
                                n && gt(n).removeClass(wt),
                                    "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !1)
                            }
                            if (gt(e).addClass(wt),
                                "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !0),
                                Ct.reflow(e),
                                gt(e).addClass("show"),
                                e.parentNode && gt(e.parentNode).hasClass("dropdown-menu")) {
                                var o = gt(e).closest(".dropdown")[0];
                                if (o) {
                                    var r = [].slice.call(o.querySelectorAll(".dropdown-toggle"));
                                    gt(r).addClass(wt)
                                }
                                e.setAttribute("aria-expanded", !0)
                            }
                            i && i()
                        },
                        n._jQueryInterface = function(i) {
                            return this.each(function() {
                                var e = gt(this),
                                    t = e.data(vt);
                                if (t || (t = new n(this),
                                        e.data(vt, t)),
                                    "string" == typeof i) {
                                    if (void 0 === t[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    t[i]()
                                }
                            })
                        },
                        s(n, null, [{
                            key: "VERSION",
                            get: function() {
                                return "4.1.3"
                            }
                        }]),
                        n
                }(),
                gt(document).on(bt.CLICK_DATA_API, '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', function(e) {
                    e.preventDefault(),
                        kt._jQueryInterface.call(gt(this), "show")
                }),
                gt.fn.tab = kt._jQueryInterface,
                gt.fn.tab.Constructor = kt,
                gt.fn.tab.noConflict = function() {
                    return gt.fn.tab = yt,
                        kt._jQueryInterface
                },
                kt);
        ! function(e) {
            if (void 0 === e)
                throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
            var t = e.fn.jquery.split(" ")[0].split(".");
            if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0])
                throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
        }(t),
        e.Util = Ct,
            e.Alert = At,
            e.Button = Ot,
            e.Carousel = Dt,
            e.Collapse = Nt,
            e.Dropdown = Lt,
            e.Modal = It,
            e.Popover = $t,
            e.Scrollspy = Mt,
            e.Tab = Pt,
            e.Tooltip = jt,
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
    }),
jQuery(document).ready(function(s) {
        var e, r, a = 2500,
            l = 3800,
            c = l - 3e3,
            o = 50,
            d = 150,
            u = 500,
            f = u + 800,
            p = 600,
            n = 1500;

        function h(e) {
            var t = m(e);
            if (e.parents(".cd-headline").hasClass("type")) {
                var i = e.parent(".cd-words-wrapper");
                i.addClass("selected").removeClass("waiting"),
                    setTimeout(function() {
                        i.removeClass("selected"),
                            e.removeClass("is-visible").addClass("is-hidden").children("i").removeClass("in").addClass("out")
                    }, u),
                    setTimeout(function() {
                        g(t, d)
                    }, f)
            } else if (e.parents(".cd-headline").hasClass("letters")) {
                var n = e.children("i").length >= t.children("i").length;
                ! function e(t, i, n, o) {
                    t.removeClass("in").addClass("out");
                    t.is(":last-child") ? n && setTimeout(function() {
                        h(m(i))
                    }, a) : setTimeout(function() {
                        e(t.next(), i, n, o)
                    }, o);
                    if (t.is(":last-child") && s("html").hasClass("no-csstransitions")) {
                        var r = m(i);
                        y(i, r)
                    }
                }(e.find("i").eq(0), e, n, o),
                v(t.find("i").eq(0), t, n, o)
            } else
                e.parents(".cd-headline").hasClass("clip") ? e.parents(".cd-words-wrapper").animate({
                    width: "2px"
                }, p, function() {
                    y(e, t),
                        g(t)
                }) : e.parents(".cd-headline").hasClass("loading-bar") ? (e.parents(".cd-words-wrapper").removeClass("is-loading"),
                    y(e, t),
                    setTimeout(function() {
                        h(t)
                    }, l),
                    setTimeout(function() {
                        e.parents(".cd-words-wrapper").addClass("is-loading")
                    }, c)) : (y(e, t),
                    setTimeout(function() {
                        h(t)
                    }, a))
        }

        function g(e, t) {
            e.parents(".cd-headline").hasClass("type") ? (v(e.find("i").eq(0), e, !1, t),
                e.addClass("is-visible").removeClass("is-hidden")) : e.parents(".cd-headline").hasClass("clip") && e.parents(".cd-words-wrapper").animate({
                width: e.width() + 10
            }, p, function() {
                setTimeout(function() {
                    h(e)
                }, n)
            })
        }

        function v(e, t, i, n) {
            e.addClass("in").removeClass("out"),
                e.is(":last-child") ? (t.parents(".cd-headline").hasClass("type") && setTimeout(function() {
                        t.parents(".cd-words-wrapper").addClass("waiting")
                    }, 200),
                    i || setTimeout(function() {
                        h(t)
                    }, a)) : setTimeout(function() {
                    v(e.next(), t, i, n)
                }, n)
        }

        function m(e) {
            return e.is(":last-child") ? e.parent().children().eq(0) : e.next()
        }

        function y(e, t) {
            e.removeClass("is-visible").addClass("is-hidden"),
                t.removeClass("is-hidden").addClass("is-visible")
        }
        s(".cd-headline.letters").find("b").each(function() {
                var e = s(this),
                    t = e.text().split(""),
                    n = e.hasClass("is-visible");
                for (i in t)
                    0 < e.parents(".rotate-2").length && (t[i] = "<em>" + t[i] + "</em>"),
                    t[i] = n ? '<i class="in">' + t[i] + "</i>" : "<i>" + t[i] + "</i>";
                var o = t.join("");
                e.html(o).css("opacity", 1)
            }),
            e = s(".cd-headline"),
            r = a,
            e.each(function() {
                var e = s(this);
                if (e.hasClass("loading-bar"))
                    r = l,
                    setTimeout(function() {
                        e.find(".cd-words-wrapper").addClass("is-loading")
                    }, c);
                else if (e.hasClass("clip")) {
                    var t = e.find(".cd-words-wrapper"),
                        i = t.width() + 10;
                    t.css("width", i)
                } else if (!e.hasClass("type")) {
                    var n = e.find(".cd-words-wrapper b"),
                        o = 0;
                    n.each(function() {
                            var e = s(this).width();
                            o < e && (o = e)
                        }),
                        e.find(".cd-words-wrapper").css("width", o)
                }
                setTimeout(function() {
                    h(e.find(".is-visible").eq(0))
                }, r)
            })
    }),
    function(P, e) {
        P.fn.drawDoughnutChart = function(b, e) {
            var n = this,
                t = n.width(),
                i = n.height(),
                w = t / 2,
                x = i / 2,
                _ = Math.cos,
                k = Math.sin,
                T = Math.PI,
                S = P.extend({
                    segmentShowStroke: !0,
                    segmentStrokeColor: "#0C1013",
                    segmentStrokeWidth: 0,
                    baseColor: "rgba(26,26,132,1)",
                    baseOffset: 10,
                    edgeOffset: 10,
                    percentageInnerCutout: 75,
                    animation: !0,
                    animationSteps: 90,
                    animationEasing: "easeInOutExpo",
                    animateRotate: !0,
                    tipOffsetX: -8,
                    tipOffsetY: -45,
                    tipClass: "doughnutTip",
                    summaryClass: "doughnutSummary",
                    summaryTitle: "Total",
                    summaryTitleClass: "doughnutSummaryTitle",
                    summaryNumberClass: "doughnutSummaryNumber",
                    beforeDraw: function() {},
                    afterDrawed: function() {},
                    onPathEnter: function(e, t) {},
                    onPathLeave: function(e, t) {}
                }, e),
                o = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
                    window.setTimeout(e, 1e3 / 60)
                };
            S.beforeDraw.call(n);
            var r, s = P('<svg width="' + t + '" height="' + i + '" viewBox="0 0 ' + t + " " + i + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo(n),
                E = [],
                a = {
                    linear: function(e) {
                        return e
                    },
                    easeInOutExpo: function(e) {
                        var t = e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e;
                        return 1 < t ? 1 : t
                    }
                }[S.animationEasing],
                C = (r = [i / 2, t / 2],
                    Math.min.apply(null, r) - S.edgeOffset),
                A = C * (S.percentageInnerCutout / 100),
                O = 0,
                l = C + S.baseOffset,
                c = A - S.baseOffset;
            P(document.createElementNS("http://www.w3.org/2000/svg", "path")).attr({
                d: L(l, c),
                fill: S.baseColor
            }).appendTo(s);
            var D = P(document.createElementNS("http://www.w3.org/2000/svg", "g"));
            D.attr({
                opacity: 0
            }).appendTo(s);
            for (var d, u, f, p = P('<div class="' + S.tipClass + '" />').appendTo("body").hide(), h = (p.width(),
                    p.height(),
                    2 * (A - (C - A))), g = P('<div class="' + S.summaryClass + '" />').appendTo(n).css({
                    width: h + "px",
                    height: h + "px",
                    "margin-left": -h / 2 + "px",
                    "margin-top": -h / 2 + "px"
                }), N = (P('<p class="' + S.summaryTitleClass + '">' + S.summaryTitle + "</p>").appendTo(g),
                    P('<p class="' + S.summaryNumberClass + '"></p>').appendTo(g).css({
                        opacity: 0
                    })), v = 0, m = b.length; v < m; v++)
                O += b[v].value,
                E[v] = P(document.createElementNS("http://www.w3.org/2000/svg", "path")).attr({
                    "stroke-width": S.segmentStrokeWidth,
                    stroke: S.segmentStrokeColor,
                    fill: b[v].color,
                    "data-order": v
                }).appendTo(D).on("mouseenter", y).on("mouseleave", I).on("mousemove", j);

            function L(e, t) {
                var i = -1.57,
                    n = 4.7131,
                    o = w + _(i) * e,
                    r = x + k(i) * e,
                    s = w + _(i) * t,
                    a = x + k(i) * t,
                    l = ["M", o, r, "A", e, e, 0, 1, 1, w + _(n) * e, x + k(n) * e, "Z", "M", w + _(n) * t, x + k(n) * t, "A", t, t, 0, 1, 0, s, a, "Z"];
                return l = l.join(" ")
            }

            function y(e) {
                var t = P(this).data().order;
                p.text(b[t].title + ": " + b[t].value + "%").fadeIn(200),
                    S.onPathEnter.apply(P(this), [e, b])
            }

            function I(e) {
                p.hide(),
                    S.onPathLeave.apply(P(this), [e, b])
            }

            function j(e) {
                p.css({
                    top: e.pageY + S.tipOffsetY,
                    left: e.pageX - p.width() / 2 + S.tipOffsetX
                })
            }

            function $(e) {
                return !isNaN(parseFloat(e)) && isFinite(e)
            }

            function M(e, t, i) {
                return $(t) && t < e ? t : $(i) && e < i ? i : e
            }
            return d = function(e) {
                    var t = -T / 2,
                        i = 1;
                    S.animation && S.animateRotate && (i = e);
                    if (n = e,
                        o = O,
                        N.css({
                            opacity: n
                        }).text((o * n).toFixed(1)),
                        D.attr("opacity", e),
                        1 === b.length && 4.7122 < i * (b[0].value / O * (2 * T)) + t)
                        return void E[0].attr("d", L(C, A));
                    var n, o;
                    for (var r = 0, s = b.length; r < s; r++) {
                        var a = i * (b[r].value / O * (2 * T)),
                            l = t + a,
                            c = T < (l - t) % (2 * T) ? 1 : 0,
                            d = w + _(t) * C,
                            u = x + k(t) * C,
                            f = w + _(t) * A,
                            p = x + k(t) * A,
                            h = w + _(l) * C,
                            g = x + k(l) * C,
                            v = w + _(l) * A,
                            m = x + k(l) * A,
                            y = ["M", d, u, "A", C, C, 0, c, 1, h, g, "L", v, m, "A", A, A, 0, c, 0, f, p, "Z"];
                        E[r].attr("d", y.join(" ")),
                            t += a
                    }
                },
                u = S.animation ? 1 / M(S.animationSteps, Number.MAX_VALUE, 1) : 1,
                f = S.animation ? 0 : 1,
                o(function() {
                    var e, t, i;
                    e = f += u,
                        t = d,
                        i = S.animation ? M(a(e), null, 0) : 1,
                        t(i),
                        f <= 1 ? o(arguments.callee) : S.afterDrawed.call(n)
                }),
                n
        }
    }(jQuery),
    $(document).ready(function() {
        checkWidth(!0),
            $(window).resize(function() {
                checkWidth(!1)
            })
    }),

    $(function() {
        $("#loading").show();

        $.get("./json/lira.json", function(data) {

            artifact = data;

            waitForGlobal(InitMyWallet);
        });

    }),
    //    navMenu(),
    //  countDown(),
    function(s) {
        "use strict";
        var t = {
            upKey: 38,
            downKey: 40,
            easing: "linear",
            scrollTime: 600,
            activeClass: "active",
            onPageChange: null,
            topOffset: 0
        };
        s.scrollIt = function(e) {
            var n = s.extend(t, e),
                o = 0,
                i = s("[data-scroll-index]:last").attr("data-scroll-index"),
                r = function(e) {
                    if (!(e < 0 || i < e)) {
                        var t = s("[data-scroll-index=" + e + "]").offset().top + n.topOffset + 1;
                        s("html,body").animate({
                            scrollTop: t,
                            easing: n.easing
                        }, n.scrollTime)
                    }
                };
            s(window).on("scroll", function() {
                    var e, i = s(window).scrollTop(),
                        t = s("[data-scroll-index]").filter(function(e, t) {
                            return i >= s(t).offset().top + n.topOffset && i < s(t).offset().top + n.topOffset + s(t).outerHeight()
                        }).first().attr("data-scroll-index");
                    e = t,
                        n.onPageChange && e && o != e && n.onPageChange(e),
                        o = e,
                        s("[data-scroll-nav]").removeClass(n.activeClass),
                        s("[data-scroll-nav=" + e + "]").addClass(n.activeClass)
                }).scroll(),
                s(window).on("keydown", function(e) {
                    var t = e.which;
                    return !(s("html,body").is(":animated") && (t == n.upKey || t == n.downKey) || (t == n.upKey && 0 < o ? (r(parseInt(o) - 1),
                        1) : t == n.downKey && o < i && (r(parseInt(o) + 1),
                        1)))
                }),
                s("body").on("click", "[data-scroll-nav], [data-scroll-goto]", function(e) {
                    var t, i;
                    e.preventDefault(),
                        i = s((t = e).target).closest("[data-scroll-nav]").attr("data-scroll-nav") || s(t.target).closest("[data-scroll-goto]").attr("data-scroll-goto"),
                        r(parseInt(i))
                })
        }
    }(jQuery),
    function() {
        "use strict";

        function t(e) {
            return void 0 === this || Object.getPrototypeOf(this) !== t.prototype ? new t(e) : ((E = this).version = "3.4.0",
                E.tools = new n,
                E.isSupported() ? (E.tools.extend(E.defaults, e || {}),
                    E.defaults.container = x(E.defaults),
                    E.store = {
                        elements: {},
                        containers: []
                    },
                    E.sequences = {},
                    E.history = [],
                    E.uid = 0,
                    E.initialized = !1) : "undefined" != typeof console && console,
                E)
        }

        function x(e) {
            if (e && e.container) {
                if ("string" == typeof e.container)
                    return window.document.documentElement.querySelector(e.container);
                if (E.tools.isNode(e.container))
                    return e.container
            }
            return E.defaults.container
        }

        function _() {
            return ++E.uid
        }

        function k(e, t) {
            var i = e.config;
            return "-webkit-transition: " + e.styles.computed.transition + "-webkit-transform " + i.duration / 1e3 + "s " + i.easing + " " + t / 1e3 + "s, opacity " + i.duration / 1e3 + "s " + i.easing + " " + t / 1e3 + "s; transition: " + e.styles.computed.transition + "transform " + i.duration / 1e3 + "s " + i.easing + " " + t / 1e3 + "s, opacity " + i.duration / 1e3 + "s " + i.easing + " " + t / 1e3 + "s; "
        }

        function T(e) {
            var t, i = e.config,
                n = e.styles.transform;
            t = "top" === i.origin || "left" === i.origin ? /^-/.test(i.distance) ? i.distance.substr(1) : "-" + i.distance : i.distance,
                parseInt(i.distance) && (n.initial += " translate" + i.axis + "(" + t + ")",
                    n.target += " translate" + i.axis + "(0)"),
                i.scale && (n.initial += " scale(" + i.scale + ")",
                    n.target += " scale(1)"),
                i.rotate.x && (n.initial += " rotateX(" + i.rotate.x + "deg)",
                    n.target += " rotateX(0)"),
                i.rotate.y && (n.initial += " rotateY(" + i.rotate.y + "deg)",
                    n.target += " rotateY(0)"),
                i.rotate.z && (n.initial += " rotateZ(" + i.rotate.z + "deg)",
                    n.target += " rotateZ(0)"),
                n.initial += "; opacity: " + i.opacity + ";",
                n.target += "; opacity: " + e.styles.computed.opacity + ";"
        }

        function S() {
            if (E.isSupported()) {
                i();
                for (var e = 0; e < E.store.containers.length; e++)
                    E.store.containers[e].addEventListener("scroll", d),
                    E.store.containers[e].addEventListener("resize", d);
                E.initialized || (window.addEventListener("scroll", d),
                    window.addEventListener("resize", d),
                    E.initialized = !0)
            }
            return E
        }

        function d() {
            e(i)
        }

        function i() {
            var l, c, i, n, o;
            E.tools.forOwn(E.sequences, function(e) {
                    o = E.sequences[e],
                        i = !1;
                    for (var t = 0; t < o.elemIds.length; t++)
                        n = o.elemIds[t],
                        f(E.store.elements[n]) && !i && (i = !0);
                    o.active = i
                }),
                E.tools.forOwn(E.store.elements, function(e) {
                    var t, i, n, o, r, s, a;
                    c = E.store.elements[e],
                        a = (s = c).config.useDelay,
                        l = "always" === a || "onload" === a && !E.initialized || "once" === a && !s.seen,
                        function(e) {
                            if (e.sequence) {
                                var t = E.sequences[e.sequence.id];
                                return t.active && !t.blocked && !e.revealing && !e.disabled
                            }
                            return f(e) && !e.revealing && !e.disabled
                        }(c) ? (c.config.beforeReveal(c.domEl),
                            l ? c.domEl.setAttribute("style", c.styles.inline + c.styles.transform.target + c.styles.transition.delayed) : c.domEl.setAttribute("style", c.styles.inline + c.styles.transform.target + c.styles.transition.instant),
                            u("reveal", c, l),
                            c.revealing = !0,
                            c.seen = !0,
                            c.sequence && (t = c,
                                i = l,
                                o = n = 0,
                                (r = E.sequences[t.sequence.id]).blocked = !0,
                                i && "onload" === t.config.useDelay && (o = t.config.delay),
                                t.sequence.timer && (n = Math.abs(t.sequence.timer.started - new Date),
                                    window.clearTimeout(t.sequence.timer)),
                                t.sequence.timer = {
                                    started: new Date
                                },
                                t.sequence.timer.clock = window.setTimeout(function() {
                                    r.blocked = !1,
                                        t.sequence.timer = null,
                                        d()
                                }, Math.abs(r.interval) + o - n))) : function(e) {
                            if (e.sequence) {
                                var t = E.sequences[e.sequence.id];
                                return !t.active && e.config.reset && e.revealing && !e.disabled
                            }
                            return !f(e) && e.config.reset && e.revealing && !e.disabled
                        }(c) && (c.config.beforeReset(c.domEl),
                            c.domEl.setAttribute("style", c.styles.inline + c.styles.transform.initial + c.styles.transition.instant),
                            u("reset", c),
                            c.revealing = !1)
                })
        }

        function u(e, t, i) {
            var n = 0,
                o = 0,
                r = "after";
            switch (e) {
                case "reveal":
                    o = t.config.duration,
                        i && (o += t.config.delay),
                        r += "Reveal";
                    break;
                case "reset":
                    o = t.config.duration,
                        r += "Reset"
            }
            t.timer && (n = Math.abs(t.timer.started - new Date),
                    window.clearTimeout(t.timer.clock)),
                t.timer = {
                    started: new Date
                },
                t.timer.clock = window.setTimeout(function() {
                    t.config[r](t.domEl),
                        t.timer = null
                }, o - n)
        }

        function y(e) {
            for (var t = 0, i = 0, n = e.offsetHeight, o = e.offsetWidth; isNaN(e.offsetTop) || (t += e.offsetTop),
                isNaN(e.offsetLeft) || (i += e.offsetLeft),
                e = e.offsetParent;)
            ;
            return {
                top: t,
                left: i,
                height: n,
                width: o
            }
        }

        function f(e) {
            var t, i, n, o, r, s, a, l, c, d = y(e.domEl),
                u = {
                    width: (t = e.config.container).clientWidth,
                    height: t.clientHeight
                },
                f = function(e) {
                    if (e && e !== window.document.documentElement) {
                        var t = y(e);
                        return {
                            x: e.scrollLeft + t.left,
                            y: e.scrollTop + t.top
                        }
                    }
                    return {
                        x: window.pageXOffset,
                        y: window.pageYOffset
                    }
                }(e.config.container),
                p = e.config.viewFactor,
                h = d.height,
                g = d.width,
                v = d.top,
                m = d.left;
            return i = v + h * p,
                n = m + g * p,
                o = v + h - h * p,
                r = m + g - g * p,
                s = f.y + e.config.viewOffset.top,
                a = f.x + e.config.viewOffset.left,
                l = f.y - e.config.viewOffset.bottom + u.height,
                c = f.x - e.config.viewOffset.right + u.width,
                i < l && s < o && n < c && a < r || "fixed" === window.getComputedStyle(e.domEl).position
        }

        function n() {}
        var E, e;
        t.prototype.defaults = {
                origin: "bottom",
                distance: "20px",
                duration: 500,
                delay: 0,
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                opacity: 0,
                scale: .9,
                easing: "cubic-bezier(0.6, 0.2, 0.1, 1)",
                container: window.document.documentElement,
                mobile: !0,
                reset: !1,
                useDelay: "always",
                viewFactor: .2,
                viewOffset: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                beforeReveal: function(e) {},
                beforeReset: function(e) {},
                afterReveal: function(e) {},
                afterReset: function(e) {}
            },
            t.prototype.isSupported = function() {
                var e = document.documentElement.style;
                return "WebkitTransition" in e && "WebkitTransform" in e || "transition" in e && "transform" in e
            },
            t.prototype.reveal = function(e, t, i, n) {
                var o, r, s, a, l, c, d, u, f, p, h, g, v, m, y, b;
                if (void 0 !== t && "number" == typeof t ? (i = t,
                        t = {}) : null != t || (t = {}),
                    o = x(t),
                    u = o, !(r = "string" == typeof(d = e) ? Array.prototype.slice.call(u.querySelectorAll(d)) : E.tools.isNode(d) ? [d] : E.tools.isNodeList(d) ? Array.prototype.slice.call(d) : Array.isArray(d) ? d.filter(E.tools.isNode) : []).length)
                    return E;
                i && "number" == typeof i && (c = _(),
                    l = E.sequences[c] = {
                        id: c,
                        interval: i,
                        elemIds: [],
                        active: !1
                    });
                for (var w = 0; w < r.length; w++)
                    (a = r[w].getAttribute("data-sr-id")) ? s = E.store.elements[a] : (s = {
                        id: _(),
                        domEl: r[w],
                        seen: !1,
                        revealing: !1
                    }).domEl.setAttribute("data-sr-id", s.id),
                    l && (s.sequence = {
                            id: l.id,
                            index: l.elemIds.length
                        },
                        l.elemIds.push(s.id)),
                    v = s,
                    y = o,
                    (m = t).container && (m.container = y),
                    v.config ? v.config = E.tools.extendClone(v.config, m) : v.config = E.tools.extendClone(E.defaults, m),
                    "top" === v.config.origin || "bottom" === v.config.origin ? v.config.axis = "Y" : v.config.axis = "X",
                    h = s,
                    void 0,
                    g = window.getComputedStyle(h.domEl),
                    h.styles || (h.styles = {
                            transition: {},
                            transform: {},
                            computed: {}
                        },
                        h.styles.inline = h.domEl.getAttribute("style") || "",
                        h.styles.inline += "; visibility: visible; ",
                        h.styles.computed.opacity = g.opacity,
                        g.transition && "all 0s ease 0s" !== g.transition ? h.styles.computed.transition = g.transition + ", " : h.styles.computed.transition = ""),
                    h.styles.transition.instant = k(h, 0),
                    h.styles.transition.delayed = k(h, h.config.delay),
                    h.styles.transform.initial = " -webkit-transform:",
                    h.styles.transform.target = " -webkit-transform:",
                    T(h),
                    h.styles.transform.initial += "transform:",
                    h.styles.transform.target += "transform:",
                    T(h),
                    void 0,
                    (p = (f = s).config.container) && -1 === E.store.containers.indexOf(p) && E.store.containers.push(f.config.container),
                    E.store.elements[f.id] = f,
                    E.tools.isMobile() && !s.config.mobile || !E.isSupported() ? (s.domEl.setAttribute("style", s.styles.inline),
                        s.disabled = !0) : s.revealing || s.domEl.setAttribute("style", s.styles.inline + s.styles.transform.initial);
                return !n && E.isSupported() && (b = {
                            target: e,
                            config: t,
                            interval: i
                        },
                        E.history.push(b),
                        E.initTimeout && window.clearTimeout(E.initTimeout),
                        E.initTimeout = window.setTimeout(S, 0)),
                    E
            },
            t.prototype.sync = function() {
                if (E.history.length && E.isSupported()) {
                    for (var e = 0; e < E.history.length; e++) {
                        var t = E.history[e];
                        E.reveal(t.target, t.config, t.interval, !0)
                    }
                    S()
                }
                return E
            },
            n.prototype.isObject = function(e) {
                return null !== e && "object" == typeof e && e.constructor === Object
            },
            n.prototype.isNode = function(e) {
                return "object" == typeof window.Node ? e instanceof window.Node : e && "object" == typeof e && "number" == typeof e.nodeType && "string" == typeof e.nodeName
            },
            n.prototype.isNodeList = function(e) {
                var t = Object.prototype.toString.call(e);
                return "object" == typeof window.NodeList ? e instanceof window.NodeList : e && "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(t) && "number" == typeof e.length && (0 === e.length || this.isNode(e[0]))
            },
            n.prototype.forOwn = function(e, t) {
                if (!this.isObject(e))
                    throw new TypeError('Expected "object", but received "' + typeof e + '".');
                for (var i in e)
                    e.hasOwnProperty(i) && t(i)
            },
            n.prototype.extend = function(t, i) {
                return this.forOwn(i, function(e) {
                            this.isObject(i[e]) ? (t[e] && this.isObject(t[e]) || (t[e] = {}),
                                this.extend(t[e], i[e])) : t[e] = i[e]
                        }
                        .bind(this)),
                    t
            },
            n.prototype.extendClone = function(e, t) {
                return this.extend(this.extend({}, e), t)
            },
            n.prototype.isMobile = function() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            },
            e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
                window.setTimeout(e, 1e3 / 60)
            },
            "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
                return t
            }) : "undefined" != typeof module && module.exports ? module.exports = t : window.ScrollReveal = t
    }(),
    function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).SimpleBar = t()
    }(this, function() {
        "use strict";
        var b = function(e) {
                if ("function" != typeof e)
                    throw TypeError(String(e) + " is not a function");
                return e
            },
            u = function(e) {
                try {
                    return !!e()
                } catch (e) {
                    return !0
                }
            },
            t = {}.toString,
            o = function(e) {
                return t.call(e).slice(8, -1)
            },
            i = "".split,
            w = u(function() {
                return !Object("z").propertyIsEnumerable(0)
            }) ? function(e) {
                return "String" == o(e) ? i.call(e, "") : Object(e)
            } :
            Object,
            f = function(e) {
                if (null == e)
                    throw TypeError("Can't call method on " + e);
                return e
            },
            T = function(e) {
                return Object(f(e))
            },
            n = Math.ceil,
            r = Math.floor,
            S = function(e) {
                return isNaN(e = +e) ? 0 : (0 < e ? r : n)(e)
            },
            s = Math.min,
            E = function(e) {
                return 0 < e ? s(S(e), 9007199254740991) : 0
            },
            a = function(e) {
                return "object" == typeof e ? null !== e : "function" == typeof e
            },
            l = Array.isArray || function(e) {
                return "Array" == o(e)
            },
            e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

        function c(e, t) {
            return e(t = {
                    exports: {}
                }, t.exports),
                t.exports
        }
        var d, p, h, g = "object" == typeof window && window && window.Math == Math ? window : "object" == typeof self && self && self.Math == Math ? self : Function("return this")(),
            v = !u(function() {
                return 7 != Object.defineProperty({}, "a", {
                    get: function() {
                        return 7
                    }
                }).a
            }),
            m = g.document,
            y = a(m) && a(m.createElement),
            x = !v && !u(function() {
                return 7 != Object.defineProperty(("div",
                    y ? m.createElement("div") : {}), "a", {
                    get: function() {
                        return 7
                    }
                }).a
            }),
            C = function(e) {
                if (!a(e))
                    throw TypeError(String(e) + " is not an object");
                return e
            },
            _ = function(e, t) {
                if (!a(e))
                    return e;
                var i, n;
                if (t && "function" == typeof(i = e.toString) && !a(n = i.call(e)))
                    return n;
                if ("function" == typeof(i = e.valueOf) && !a(n = i.call(e)))
                    return n;
                if (!t && "function" == typeof(i = e.toString) && !a(n = i.call(e)))
                    return n;
                throw TypeError("Can't convert object to primitive value")
            },
            k = Object.defineProperty,
            A = {
                f: v ? k : function(e, t, i) {
                    if (C(e),
                        t = _(t, !0),
                        C(i),
                        x)
                        try {
                            return k(e, t, i)
                        } catch (e) {}
                    if ("get" in i || "set" in i)
                        throw TypeError("Accessors not supported");
                    return "value" in i && (e[t] = i.value),
                        e
                }
            },
            O = function(e, t) {
                return {
                    enumerable: !(1 & e),
                    configurable: !(2 & e),
                    writable: !(4 & e),
                    value: t
                }
            },
            D = v ? function(e, t, i) {
                return A.f(e, t, O(1, i))
            } :
            function(e, t, i) {
                return e[t] = i,
                    e
            },
            N = function(t, i) {
                try {
                    D(g, t, i)
                } catch (e) {
                    g[t] = i
                }
                return i
            },
            L = c(function(e) {
                var i = g["__core-js_shared__"] || N("__core-js_shared__", {});
                (e.exports = function(e, t) {
                    return i[e] || (i[e] = void 0 !== t ? t : {})
                })("versions", []).push({
                    version: "3.0.1",
                    mode: "global",
                    copyright: "?? 2019 Denis Pushkarev (zloirock.ru)"
                })
            }),
            I = 0,
            j = Math.random(),
            $ = function(e) {
                return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++I + j).toString(36))
            },
            M = !u(function() {
                return !String(Symbol())
            }),
            P = L("wks"),
            H = g.Symbol,
            q = function(e) {
                return P[e] || (P[e] = M && H[e] || (M ? H : $)("Symbol." + e))
            },
            W = q("species"),
            R = function(e, t) {
                var i;
                return l(e) && ("function" != typeof(i = e.constructor) || i !== Array && !l(i.prototype) ? a(i) && null === (i = i[W]) && (i = void 0) : i = void 0),
                    new(void 0 === i ? Array : i)(0 === t ? 0 : t)
            },
            F = function(u, e) {
                var f = 1 == u,
                    p = 2 == u,
                    h = 3 == u,
                    g = 4 == u,
                    v = 6 == u,
                    m = 5 == u || v,
                    y = e || R;
                return function(e, t, i) {
                    for (var n, o, r = T(e), s = w(r), a = function(n, o, e) {
                            return b(n),
                                void 0 === o ? n : function(e, t, i) {
                                    return n.call(o, e, t, i)
                                }
                        }(t, i), l = E(s.length), c = 0, d = f ? y(e, l) : p ? y(e, 0) : void 0; c < l; c++)
                        if ((m || c in s) && (o = a(n = s[c], c, r),
                                u))
                            if (f)
                                d[c] = o;
                            else if (o)
                        switch (u) {
                            case 3:
                                return !0;
                            case 5:
                                return n;
                            case 6:
                                return c;
                            case 2:
                                d.push(n)
                        }
                    else if (g)
                        return !1;
                    return v ? -1 : h || g ? g : d
                }
            },
            z = q("species"),
            B = {}.propertyIsEnumerable,
            U = Object.getOwnPropertyDescriptor,
            V = {
                f: U && !B.call({
                    1: 2
                }, 1) ? function(e) {
                    var t = U(this, e);
                    return !!t && t.enumerable
                } : B
            },
            Y = function(e) {
                return w(f(e))
            },
            X = {}.hasOwnProperty,
            Q = function(e, t) {
                return X.call(e, t)
            },
            K = Object.getOwnPropertyDescriptor,
            G = {
                f: v ? K : function(e, t) {
                    if (e = Y(e),
                        t = _(t, !0),
                        x)
                        try {
                            return K(e, t)
                        } catch (e) {}
                    if (Q(e, t))
                        return O(!V.f.call(e, t), e[t])
                }
            },
            Z = L("native-function-to-string", Function.toString),
            J = g.WeakMap,
            ee = "function" == typeof J && /native code/.test(Z.call(J)),
            te = L("keys"),
            ie = {},
            ne = g.WeakMap;
        if (ee) {
            var oe = new ne,
                re = oe.get,
                se = oe.has,
                ae = oe.set;
            d = function(e, t) {
                    return ae.call(oe, e, t),
                        t
                },
                p = function(e) {
                    return re.call(oe, e) || {}
                },
                h = function(e) {
                    return se.call(oe, e)
                }
        } else {
            var le = te["state"] || (te.state = $("state"));
            ie[le] = !0,
                d = function(e, t) {
                    return D(e, le, t),
                        t
                },
                p = function(e) {
                    return Q(e, le) ? e[le] : {}
                },
                h = function(e) {
                    return Q(e, le)
                }
        }
        var ce = {
                set: d,
                get: p,
                has: h,
                enforce: function(e) {
                    return h(e) ? p(e) : d(e, {})
                },
                getterFor: function(i) {
                    return function(e) {
                        var t;
                        if (!a(e) || (t = p(e)).type !== i)
                            throw TypeError("Incompatible receiver, " + i + " required");
                        return t
                    }
                }
            },
            de = c(function(e) {
                var t = ce.get,
                    a = ce.enforce,
                    l = String(Z).split("toString");
                L("inspectSource", function(e) {
                        return Z.call(e)
                    }),
                    (e.exports = function(e, t, i, n) {
                        var o = !!n && !!n.unsafe,
                            r = !!n && !!n.enumerable,
                            s = !!n && !!n.noTargetGet;
                        "function" == typeof i && ("string" != typeof t || Q(i, "name") || D(i, "name", t),
                                a(i).source = l.join("string" == typeof t ? t : "")),
                            e !== g ? (o ? !s && e[t] && (r = !0) : delete e[t],
                                r ? e[t] = i : D(e, t, i)) : r ? e[t] = i : N(t, i)
                    })(Function.prototype, "toString", function() {
                        return "function" == typeof this && t(this).source || Z.call(this)
                    })
            }),
            ue = Math.max,
            fe = Math.min,
            pe = (!1,
                function(e, t, i) {
                    var n, o, r = Y(e),
                        s = E(r.length),
                        a = (n = s,
                            (o = S(i)) < 0 ? ue(o + n, 0) : fe(o, n));
                    for (0; a < s; a++)
                        if (a in r && r[a] === t)
                            return a || 0;
                    return -1
                }
            ),
            he = function(e, t) {
                var i, n = Y(e),
                    o = 0,
                    r = [];
                for (i in n)
                    !Q(ie, i) && Q(n, i) && r.push(i);
                for (; t.length > o;)
                    Q(n, i = t[o++]) && (~pe(r, i) || r.push(i));
                return r
            },
            ge = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
            ve = ge.concat("length", "prototype"),
            me = {
                f: Object.getOwnPropertyNames || function(e) {
                    return he(e, ve)
                }
            },
            ye = {
                f: Object.getOwnPropertySymbols
            },
            be = g.Reflect,
            we = be && be.ownKeys || function(e) {
                var t = me.f(C(e)),
                    i = ye.f;
                return i ? t.concat(i(e)) : t
            },
            xe = function(e, t) {
                for (var i = we(t), n = A.f, o = G.f, r = 0; r < i.length; r++) {
                    var s = i[r];
                    Q(e, s) || n(e, s, o(t, s))
                }
            },
            _e = /#|\.prototype\./,
            ke = function(e, t) {
                var i = Se[Te(e)];
                return i == Ce || i != Ee && ("function" == typeof t ? u(t) : !!t)
            },
            Te = ke.normalize = function(e) {
                return String(e).replace(_e, ".").toLowerCase()
            },
            Se = ke.data = {},
            Ee = ke.NATIVE = "N",
            Ce = ke.POLYFILL = "P",
            Ae = ke,
            Oe = G.f,
            De = function(e, t) {
                var i, n, o, r, s, a = e.target,
                    l = e.global,
                    c = e.stat;
                if (i = l ? g : c ? g[a] || N(a, {}) : (g[a] || {}).prototype)
                    for (n in t) {
                        if (r = t[n],
                            o = e.noTargetGet ? (s = Oe(i, n)) && s.value : i[n], !Ae(l ? n : a + (c ? "." : "#") + n, e.forced) && void 0 !== o) {
                            if (typeof r == typeof o)
                                continue;
                            xe(r, o)
                        }
                        (e.sham || o && o.sham) && D(r, "sham", !0),
                            de(i, n, r, e)
                    }
            },
            Ne = F(2);
        De({
            target: "Array",
            proto: !0,
            forced: ("filter", !!u(function() {
                var e = [];
                return (e.constructor = {})[z] = function() {
                        return {
                            foo: 1
                        }
                    },
                    1 !== e.filter(Boolean).foo
            }))
        }, {
            filter: function(e) {
                return Ne(this, e, arguments[1])
            }
        });
        var Le = function(e, t) {
                var i = [][e];
                return !i || !u(function() {
                    i.call(null, t || function() {
                        throw 1
                    }, 1)
                })
            },
            Ie = [].forEach,
            je = F(0),
            $e = Le("forEach") ? function(e) {
                return je(this, e, arguments[1])
            } :
            Ie;
        De({
                target: "Array",
                proto: !0,
                forced: [].forEach != $e
            }, {
                forEach: $e
            }),
            De({
                target: "Array",
                proto: !0,
                forced: Le("reduce")
            }, {
                reduce: function(e) {
                    return function(e, t, i, n, o) {
                        b(t);
                        var r = T(e),
                            s = w(r),
                            a = E(r.length),
                            l = 0;
                        if (i < 2)
                            for (;;) {
                                if (l in s) {
                                    n = s[l],
                                        l += 1;
                                    break
                                }
                                if (a <= (l += 1))
                                    throw TypeError("Reduce of empty array with no initial value")
                            }
                        for (; l < a; l += 1)
                            l in s && (n = t(n, s[l], l, r));
                        return n
                    }(this, e, arguments.length, arguments[1])
                }
            });
        var Me = A.f,
            Pe = Function.prototype,
            He = Pe.toString,
            qe = /^\s*function ([^ (]*)/;
        !v || "name" in Pe || Me(Pe, "name", {
            configurable: !0,
            get: function() {
                try {
                    return He.call(this).match(qe)[1]
                } catch (e) {
                    return ""
                }
            }
        });
        var We = Object.keys || function(e) {
                return he(e, ge)
            },
            Re = Object.assign,
            Fe = !Re || u(function() {
                var e = {},
                    t = {},
                    i = Symbol();
                return e[i] = 7,
                    "abcdefghijklmnopqrst".split("").forEach(function(e) {
                        t[e] = e
                    }),
                    7 != Re({}, e)[i] || "abcdefghijklmnopqrst" != We(Re({}, t)).join("")
            }) ? function(e, t) {
                for (var i = T(e), n = arguments.length, o = 1, r = ye.f, s = V.f; o < n;)
                    for (var a, l = w(arguments[o++]), c = r ? We(l).concat(r(l)) : We(l), d = c.length, u = 0; u < d;)
                        s.call(l, a = c[u++]) && (i[a] = l[a]);
                return i
            } :
            Re;
        De({
            target: "Object",
            stat: !0,
            forced: Object.assign !== Fe
        }, {
            assign: Fe
        });
        var ze = "\t\n\v\f\r ???????????????????????????????????????????????\u2028\u2029\ufeff",
            Be = "[" + ze + "]",
            Ue = RegExp("^" + Be + Be + "*"),
            Ve = RegExp(Be + Be + "*$"),
            Ye = g.parseInt,
            Xe = /^[-+]?0[xX]/,
            Qe = 8 !== Ye(ze + "08") || 22 !== Ye(ze + "0x16") ? function(e, t) {
                var i, n = (i = String(e),
                    i = (i = (i = String(f(i))).replace(Ue, "")).replace(Ve, ""));
                return Ye(n, t >>> 0 || (Xe.test(n) ? 16 : 10))
            } :
            Ye;
        De({
            global: !0,
            forced: parseInt != Qe
        }, {
            parseInt: Qe
        });
        var Ke, Ge, Ze = RegExp.prototype.exec,
            Je = String.prototype.replace,
            et = Ze,
            tt = (Ke = /a/,
                Ge = /b*/g,
                Ze.call(Ke, "a"),
                Ze.call(Ge, "a"),
                0 !== Ke.lastIndex || 0 !== Ge.lastIndex),
            it = void 0 !== /()??/.exec("")[1];
        (tt || it) && (et = function(e) {
            var t, i, n, o;
            return it && (i = new RegExp("^" + this.source + "$(?!\\s)", function() {
                        var e = C(this),
                            t = "";
                        return e.global && (t += "g"),
                            e.ignoreCase && (t += "i"),
                            e.multiline && (t += "m"),
                            e.unicode && (t += "u"),
                            e.sticky && (t += "y"),
                            t
                    }
                    .call(this))),
                tt && (t = this.lastIndex),
                n = Ze.call(this, e),
                tt && n && (this.lastIndex = this.global ? n.index + n[0].length : t),
                it && n && 1 < n.length && Je.call(n[0], i, function() {
                    for (o = 1; o < arguments.length - 2; o++)
                        void 0 === arguments[o] && (n[o] = void 0)
                }),
                n
        });
        var nt = et;
        De({
            target: "RegExp",
            proto: !0,
            forced: /./.exec !== nt
        }, {
            exec: nt
        });
        var ot = function(e, t, i) {
                return t + (i ? (n = t,
                    s = String(f(e)),
                    a = S(n),
                    l = s.length,
                    a < 0 || l <= a ? "" : (o = s.charCodeAt(a)) < 55296 || 56319 < o || a + 1 === l || (r = s.charCodeAt(a + 1)) < 56320 || 57343 < r ? s.charAt(a) : s.slice(a, a + 2)).length : 1);
                var n, o, r, s, a, l
            },
            rt = function(e, t) {
                var i = e.exec;
                if ("function" == typeof i) {
                    var n = i.call(e, t);
                    if ("object" != typeof n)
                        throw TypeError("RegExp exec method returned something other than an Object or null");
                    return n
                }
                if ("RegExp" !== o(e))
                    throw TypeError("RegExp#exec called on incompatible receiver");
                return nt.call(e, t)
            },
            st = q("species"),
            at = !u(function() {
                var e = /./;
                return e.exec = function() {
                        var e = [];
                        return e.groups = {
                                a: "7"
                            },
                            e
                    },
                    "7" !== "".replace(e, "$<a>")
            }),
            lt = !u(function() {
                var e = /(?:)/,
                    t = e.exec;
                e.exec = function() {
                    return t.apply(this, arguments)
                };
                var i = "ab".split(e);
                return 2 !== i.length || "a" !== i[0] || "b" !== i[1]
            }),
            ct = function(i, e, t, n) {
                var o = q(i),
                    r = !u(function() {
                        var e = {};
                        return e[o] = function() {
                                return 7
                            },
                            7 != "" [i](e)
                    }),
                    s = r && !u(function() {
                        var e = !1,
                            t = /a/;
                        return t.exec = function() {
                                return e = !0,
                                    null
                            },
                            "split" === i && (t.constructor = {},
                                t.constructor[st] = function() {
                                    return t
                                }
                            ),
                            t[o](""), !e
                    });
                if (!r || !s || "replace" === i && !at || "split" === i && !lt) {
                    var a = /./ [o],
                        l = t(o, "" [i], function(e, t, i, n, o) {
                            return t.exec === nt ? r && !o ? {
                                done: !0,
                                value: a.call(t, i, n)
                            } : {
                                done: !0,
                                value: e.call(i, t, n)
                            } : {
                                done: !1
                            }
                        }),
                        c = l[0],
                        d = l[1];
                    de(String.prototype, i, c),
                        de(RegExp.prototype, o, 2 == e ? function(e, t) {
                                return d.call(e, this, t)
                            } :
                            function(e) {
                                return d.call(e, this)
                            }
                        ),
                        n && D(RegExp.prototype[o], "sham", !0)
                }
            };
        ct("match", 1, function(n, c, d) {
            return [function(e) {
                var t = f(this),
                    i = null == e ? void 0 : e[n];
                return void 0 !== i ? i.call(e, t) : new RegExp(e)[n](String(t))
            }, function(e) {
                var t = d(c, e, this);
                if (t.done)
                    return t.value;
                var i = C(e),
                    n = String(this);
                if (!i.global)
                    return rt(i, n);
                for (var o, r = i.unicode, s = [], a = i.lastIndex = 0; null !== (o = rt(i, n));) {
                    var l = String(o[0]);
                    "" === (s[a] = l) && (i.lastIndex = ot(n, E(i.lastIndex), r)),
                    a++
                }
                return 0 === a ? null : s
            }]
        });
        var dt = Math.max,
            ut = Math.min,
            ft = Math.floor,
            pt = /\$([$&`']|\d\d?|<[^>]*>)/g,
            ht = /\$([$&`']|\d\d?)/g;
        for (var gt in ct("replace", 2, function(o, x, _) {
                return [function(e, t) {
                    var i = f(this),
                        n = null == e ? void 0 : e[o];
                    return void 0 !== n ? n.call(e, i, t) : x.call(String(i), e, t)
                }, function(e, t) {
                    var i = _(x, e, this, t);
                    if (i.done)
                        return i.value;
                    var n = C(e),
                        o = String(this),
                        r = "function" == typeof t;
                    r || (t = String(t));
                    var s = n.global;
                    if (s) {
                        var a = n.unicode;
                        n.lastIndex = 0
                    }
                    for (var l = [];;) {
                        var c = rt(n, o);
                        if (null === c)
                            break;
                        if (l.push(c), !s)
                            break;
                        "" === String(c[0]) && (n.lastIndex = ot(o, E(n.lastIndex), a))
                    }
                    for (var d, u = "", f = 0, p = 0; p < l.length; p++) {
                        c = l[p];
                        for (var h = String(c[0]), g = dt(ut(S(c.index), o.length), 0), v = [], m = 1; m < c.length; m++)
                            v.push(void 0 === (d = c[m]) ? d : String(d));
                        var y = c.groups;
                        if (r) {
                            var b = [h].concat(v, g, o);
                            void 0 !== y && b.push(y);
                            var w = String(t.apply(void 0, b))
                        } else
                            w = k(h, o, g, v, y, t);
                        f <= g && (u += o.slice(f, g) + w,
                            f = g + h.length)
                    }
                    return u + o.slice(f)
                }];

                function k(r, s, a, l, c, e) {
                    var d = a + r.length,
                        u = l.length,
                        t = ht;
                    return void 0 !== c && (c = T(c),
                            t = pt),
                        x.call(e, t, function(e, t) {
                            var i;
                            switch (t.charAt(0)) {
                                case "$":
                                    return "$";
                                case "&":
                                    return r;
                                case "`":
                                    return s.slice(0, a);
                                case "'":
                                    return s.slice(d);
                                case "<":
                                    i = c[t.slice(1, -1)];
                                    break;
                                default:
                                    var n = +t;
                                    if (0 === n)
                                        return e;
                                    if (u < n) {
                                        var o = ft(n / 10);
                                        return 0 === o ? e : o <= u ? void 0 === l[o - 1] ? t.charAt(1) : l[o - 1] + t.charAt(1) : e
                                    }
                                    i = l[n - 1]
                            }
                            return void 0 === i ? "" : i
                        })
                }
            }), {
                CSSRuleList: 0,
                CSSStyleDeclaration: 0,
                CSSValueList: 0,
                ClientRectList: 0,
                DOMRectList: 0,
                DOMStringList: 0,
                DOMTokenList: 1,
                DataTransferItemList: 0,
                FileList: 0,
                HTMLAllCollection: 0,
                HTMLCollection: 0,
                HTMLFormElement: 0,
                HTMLSelectElement: 0,
                MediaList: 0,
                MimeTypeArray: 0,
                NamedNodeMap: 0,
                NodeList: 1,
                PaintRequestList: 0,
                Plugin: 0,
                PluginArray: 0,
                SVGLengthList: 0,
                SVGNumberList: 0,
                SVGPathSegList: 0,
                SVGPointList: 0,
                SVGStringList: 0,
                SVGTransformList: 0,
                SourceBufferList: 0,
                StyleSheetList: 0,
                TextTrackCueList: 0,
                TextTrackList: 0,
                TouchList: 0
            }) {
            var vt = g[gt],
                mt = vt && vt.prototype;
            if (mt && mt.forEach !== $e)
                try {
                    D(mt, "forEach", $e)
                } catch (b) {
                    mt.forEach = $e
                }
        }
        var yt = c(function(e, t) {
                e.exports = function() {
                    if ("undefined" == typeof document)
                        return 0;
                    var e, t = document.body,
                        i = document.createElement("div"),
                        n = i.style;
                    return n.position = "absolute",
                        n.top = n.left = "-9999px",
                        n.width = n.height = "100px",
                        n.overflow = "scroll",
                        t.appendChild(i),
                        e = i.offsetWidth - i.clientWidth,
                        t.removeChild(i),
                        e
                }
            }),
            bt = "Expected a function",
            wt = NaN,
            xt = "[object Symbol]",
            _t = /^\s+|\s+$/g,
            kt = /^[-+]0x[0-9a-f]+$/i,
            Tt = /^0b[01]+$/i,
            St = /^0o[0-7]+$/i,
            Et = parseInt,
            Ct = "object" == typeof e && e && e.Object === Object && e,
            At = "object" == typeof self && self && self.Object === Object && self,
            Ot = Ct || At || Function("return this")(),
            Dt = Object.prototype.toString,
            Nt = Math.max,
            Lt = Math.min,
            It = function() {
                return Ot.Date.now()
            };

        function jt(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }

        function $t(e) {
            if ("number" == typeof e)
                return e;
            if ("symbol" == typeof(t = e) || t && "object" == typeof t && Dt.call(t) == xt)
                return wt;
            var t;
            if (jt(e)) {
                var i = "function" == typeof e.valueOf ? e.valueOf() : e;
                e = jt(i) ? i + "" : i
            }
            if ("string" != typeof e)
                return 0 === e ? e : +e;
            e = e.replace(_t, "");
            var n = Tt.test(e);
            return n || St.test(e) ? Et(e.slice(2), n ? 2 : 8) : kt.test(e) ? wt : +e
        }
        var Mt = function(e, t, i) {
                var n = !0,
                    o = !0;
                if ("function" != typeof e)
                    throw new TypeError(bt);
                return jt(i) && (n = "leading" in i ? !!i.leading : n,
                        o = "trailing" in i ? !!i.trailing : o),
                    function(n, o, e) {
                        var r, s, i, a, l, c, d = 0,
                            u = !1,
                            f = !1,
                            t = !0;
                        if ("function" != typeof n)
                            throw new TypeError(bt);

                        function p(e) {
                            var t = r,
                                i = s;
                            return r = s = void 0,
                                d = e,
                                a = n.apply(i, t)
                        }

                        function h(e) {
                            var t = e - c;
                            return void 0 === c || o <= t || t < 0 || f && i <= e - d
                        }

                        function g() {
                            var e, t = It();
                            if (h(t))
                                return v(t);
                            l = setTimeout(g, (e = o - (t - c),
                                f ? Lt(e, i - (t - d)) : e))
                        }

                        function v(e) {
                            return l = void 0,
                                t && r ? p(e) : (r = s = void 0,
                                    a)
                        }

                        function m() {
                            var e, t = It(),
                                i = h(t);
                            if (r = arguments,
                                s = this,
                                c = t,
                                i) {
                                if (void 0 === l)
                                    return d = e = c,
                                        l = setTimeout(g, o),
                                        u ? p(e) : a;
                                if (f)
                                    return l = setTimeout(g, o),
                                        p(c)
                            }
                            return void 0 === l && (l = setTimeout(g, o)),
                                a
                        }
                        return o = $t(o) || 0,
                            jt(e) && (u = !!e.leading,
                                i = (f = "maxWait" in e) ? Nt($t(e.maxWait) || 0, o) : i,
                                t = "trailing" in e ? !!e.trailing : t),
                            m.cancel = function() {
                                void 0 !== l && clearTimeout(l),
                                    r = c = s = l = void(d = 0)
                            },
                            m.flush = function() {
                                return void 0 === l ? a : v(It())
                            },
                            m
                    }(e, t, {
                        leading: n,
                        maxWait: t,
                        trailing: o
                    })
            },
            Pt = /^\s+|\s+$/g,
            Ht = /^[-+]0x[0-9a-f]+$/i,
            qt = /^0b[01]+$/i,
            Wt = /^0o[0-7]+$/i,
            Rt = parseInt,
            Ft = "object" == typeof e && e && e.Object === Object && e,
            zt = "object" == typeof self && self && self.Object === Object && self,
            Bt = Ft || zt || Function("return this")(),
            Ut = Object.prototype.toString,
            Vt = Math.max,
            Yt = Math.min,
            Xt = function() {
                return Bt.Date.now()
            };

        function Qt(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }

        function Kt(e) {
            if ("number" == typeof e)
                return e;
            if ("symbol" == typeof(t = e) || t && "object" == typeof t && "[object Symbol]" == Ut.call(t))
                return NaN;
            var t;
            if (Qt(e)) {
                var i = "function" == typeof e.valueOf ? e.valueOf() : e;
                e = Qt(i) ? i + "" : i
            }
            if ("string" != typeof e)
                return 0 === e ? e : +e;
            e = e.replace(Pt, "");
            var n = qt.test(e);
            return n || Wt.test(e) ? Rt(e.slice(2), n ? 2 : 8) : Ht.test(e) ? NaN : +e
        }
        var Gt, Zt = function(n, o, e) {
                var r, s, i, a, l, c, d = 0,
                    u = !1,
                    f = !1,
                    t = !0;
                if ("function" != typeof n)
                    throw new TypeError("Expected a function");

                function p(e) {
                    var t = r,
                        i = s;
                    return r = s = void 0,
                        d = e,
                        a = n.apply(i, t)
                }

                function h(e) {
                    var t = e - c;
                    return void 0 === c || o <= t || t < 0 || f && i <= e - d
                }

                function g() {
                    var e, t = Xt();
                    if (h(t))
                        return v(t);
                    l = setTimeout(g, (e = o - (t - c),
                        f ? Yt(e, i - (t - d)) : e))
                }

                function v(e) {
                    return l = void 0,
                        t && r ? p(e) : (r = s = void 0,
                            a)
                }

                function m() {
                    var e, t = Xt(),
                        i = h(t);
                    if (r = arguments,
                        s = this,
                        c = t,
                        i) {
                        if (void 0 === l)
                            return d = e = c,
                                l = setTimeout(g, o),
                                u ? p(e) : a;
                        if (f)
                            return l = setTimeout(g, o),
                                p(c)
                    }
                    return void 0 === l && (l = setTimeout(g, o)),
                        a
                }
                return o = Kt(o) || 0,
                    Qt(e) && (u = !!e.leading,
                        i = (f = "maxWait" in e) ? Vt(Kt(e.maxWait) || 0, o) : i,
                        t = "trailing" in e ? !!e.trailing : t),
                    m.cancel = function() {
                        void 0 !== l && clearTimeout(l),
                            r = c = s = l = void(d = 0)
                    },
                    m.flush = function() {
                        return void 0 === l ? a : v(Xt())
                    },
                    m
            },
            Jt = "Expected a function",
            ei = "__lodash_hash_undefined__",
            ti = "[object Function]",
            ii = "[object GeneratorFunction]",
            ni = /^\[object .+?Constructor\]$/,
            oi = "object" == typeof e && e && e.Object === Object && e,
            ri = "object" == typeof self && self && self.Object === Object && self,
            si = oi || ri || Function("return this")(),
            ai = Array.prototype,
            li = Function.prototype,
            ci = Object.prototype,
            di = si["__core-js_shared__"],
            ui = (Gt = /[^.]+$/.exec(di && di.keys && di.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Gt : "",
            fi = li.toString,
            pi = ci.hasOwnProperty,
            hi = ci.toString,
            gi = RegExp("^" + fi.call(pi).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
            vi = ai.splice,
            mi = Ti(si, "Map"),
            yi = Ti(Object, "create");

        function bi(e) {
            var t = -1,
                i = e ? e.length : 0;
            for (this.clear(); ++t < i;) {
                var n = e[t];
                this.set(n[0], n[1])
            }
        }

        function wi(e) {
            var t = -1,
                i = e ? e.length : 0;
            for (this.clear(); ++t < i;) {
                var n = e[t];
                this.set(n[0], n[1])
            }
        }

        function xi(e) {
            var t = -1,
                i = e ? e.length : 0;
            for (this.clear(); ++t < i;) {
                var n = e[t];
                this.set(n[0], n[1])
            }
        }

        function _i(e, t) {
            for (var i, n, o = e.length; o--;)
                if ((i = e[o][0]) === (n = t) || i != i && n != n)
                    return o;
            return -1
        }

        function ki(e, t) {
            var i, n, o = e.__data__;
            return ("string" == (n = typeof(i = t)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== i : null === i) ? o["string" == typeof t ? "string" : "hash"] : o.map
        }

        function Ti(e, t) {
            var i, n, o, r = null == e ? void 0 : e[t];
            return !Ei(i = r) || ui && ui in i || !(n = i,
                o = Ei(n) ? hi.call(n) : "",
                o == ti || o == ii || function(e) {
                    var t = !1;
                    if (null != e && "function" != typeof e.toString)
                        try {
                            t = !!(e + "")
                        } catch (e) {}
                    return t
                }(i) ? gi : ni).test(function(e) {
                if (null != e) {
                    try {
                        return fi.call(e)
                    } catch (e) {}
                    try {
                        return e + ""
                    } catch (e) {}
                }
                return ""
            }(i)) ? void 0 : r
        }

        function Si(o, r) {
            if ("function" != typeof o || r && "function" != typeof r)
                throw new TypeError(Jt);
            var s = function() {
                var e = arguments,
                    t = r ? r.apply(this, e) : e[0],
                    i = s.cache;
                if (i.has(t))
                    return i.get(t);
                var n = o.apply(this, e);
                return s.cache = i.set(t, n),
                    n
            };
            return s.cache = new(Si.Cache || xi),
                s
        }

        function Ei(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }
        bi.prototype.clear = function() {
                this.__data__ = yi ? yi(null) : {}
            },
            bi.prototype.delete = function(e) {
                return this.has(e) && delete this.__data__[e]
            },
            bi.prototype.get = function(e) {
                var t = this.__data__;
                if (yi) {
                    var i = t[e];
                    return i === ei ? void 0 : i
                }
                return pi.call(t, e) ? t[e] : void 0
            },
            bi.prototype.has = function(e) {
                var t = this.__data__;
                return yi ? void 0 !== t[e] : pi.call(t, e)
            },
            bi.prototype.set = function(e, t) {
                return this.__data__[e] = yi && void 0 === t ? ei : t,
                    this
            },
            wi.prototype.clear = function() {
                this.__data__ = []
            },
            wi.prototype.delete = function(e) {
                var t = this.__data__,
                    i = _i(t, e);
                return !(i < 0 || (i == t.length - 1 ? t.pop() : vi.call(t, i, 1),
                    0))
            },
            wi.prototype.get = function(e) {
                var t = this.__data__,
                    i = _i(t, e);
                return i < 0 ? void 0 : t[i][1]
            },
            wi.prototype.has = function(e) {
                return -1 < _i(this.__data__, e)
            },
            wi.prototype.set = function(e, t) {
                var i = this.__data__,
                    n = _i(i, e);
                return n < 0 ? i.push([e, t]) : i[n][1] = t,
                    this
            },
            xi.prototype.clear = function() {
                this.__data__ = {
                    hash: new bi,
                    map: new(mi || wi),
                    string: new bi
                }
            },
            xi.prototype.delete = function(e) {
                return ki(this, e).delete(e)
            },
            xi.prototype.get = function(e) {
                return ki(this, e).get(e)
            },
            xi.prototype.has = function(e) {
                return ki(this, e).has(e)
            },
            xi.prototype.set = function(e, t) {
                return ki(this, e).set(e, t),
                    this
            },
            Si.Cache = xi;
        var Ci = Si,
            Ai = function() {
                if ("undefined" != typeof Map)
                    return Map;

                function n(e, i) {
                    var n = -1;
                    return e.some(function(e, t) {
                            return e[0] === i && (n = t, !0)
                        }),
                        n
                }
                return function() {
                    function e() {
                        this.__entries__ = []
                    }
                    return Object.defineProperty(e.prototype, "size", {
                            get: function() {
                                return this.__entries__.length
                            },
                            enumerable: !0,
                            configurable: !0
                        }),
                        e.prototype.get = function(e) {
                            var t = n(this.__entries__, e),
                                i = this.__entries__[t];
                            return i && i[1]
                        },
                        e.prototype.set = function(e, t) {
                            var i = n(this.__entries__, e);
                            ~i ? this.__entries__[i][1] = t : this.__entries__.push([e, t])
                        },
                        e.prototype.delete = function(e) {
                            var t = this.__entries__,
                                i = n(t, e);
                            ~i && t.splice(i, 1)
                        },
                        e.prototype.has = function(e) {
                            return !!~n(this.__entries__, e)
                        },
                        e.prototype.clear = function() {
                            this.__entries__.splice(0)
                        },
                        e.prototype.forEach = function(e, t) {
                            void 0 === t && (t = null);
                            for (var i = 0, n = this.__entries__; i < n.length; i++) {
                                var o = n[i];
                                e.call(t, o[1], o[0])
                            }
                        },
                        e
                }()
            }(),
            Oi = "undefined" != typeof window && "undefined" != typeof document && window.document === document,
            Di = "undefined" != typeof global && global.Math === Math ? global : "undefined" != typeof self && self.Math === Math ? self : "undefined" != typeof window && window.Math === Math ? window : Function("return this")(),
            Ni = "function" == typeof requestAnimationFrame ? requestAnimationFrame.bind(Di) : function(e) {
                return setTimeout(function() {
                    return e(Date.now())
                }, 1e3 / 60)
            },
            Li = ["top", "right", "bottom", "left", "width", "height", "size", "weight"],
            Ii = "undefined" != typeof MutationObserver,
            ji = function() {
                function e() {
                    this.connected_ = !1,
                        this.mutationEventsAdded_ = !1,
                        this.mutationsObserver_ = null,
                        this.observers_ = [],
                        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this),
                        this.refresh = function(e, t) {
                            var i = !1,
                                n = !1,
                                o = 0;

                            function r() {
                                i && (i = !1,
                                        e()),
                                    n && a()
                            }

                            function s() {
                                Ni(r)
                            }

                            function a() {
                                var e = Date.now();
                                if (i) {
                                    if (e - o < 2)
                                        return;
                                    n = !0
                                } else
                                    n = !(i = !0),
                                    setTimeout(s, t);
                                o = e
                            }
                            return a
                        }(this.refresh.bind(this), 20)
                }
                return e.prototype.addObserver = function(e) {
                        ~this.observers_.indexOf(e) || this.observers_.push(e),
                            this.connected_ || this.connect_()
                    },
                    e.prototype.removeObserver = function(e) {
                        var t = this.observers_,
                            i = t.indexOf(e);
                        ~i && t.splice(i, 1), !t.length && this.connected_ && this.disconnect_()
                    },
                    e.prototype.refresh = function() {
                        this.updateObservers_() && this.refresh()
                    },
                    e.prototype.updateObservers_ = function() {
                        var e = this.observers_.filter(function(e) {
                            return e.gatherActive(),
                                e.hasActive()
                        });
                        return e.forEach(function(e) {
                                return e.broadcastActive()
                            }),
                            0 < e.length
                    },
                    e.prototype.connect_ = function() {
                        Oi && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_),
                            window.addEventListener("resize", this.refresh),
                            Ii ? (this.mutationsObserver_ = new MutationObserver(this.refresh),
                                this.mutationsObserver_.observe(document, {
                                    attributes: !0,
                                    childList: !0,
                                    characterData: !0,
                                    subtree: !0
                                })) : (document.addEventListener("DOMSubtreeModified", this.refresh),
                                this.mutationEventsAdded_ = !0),
                            this.connected_ = !0)
                    },
                    e.prototype.disconnect_ = function() {
                        Oi && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_),
                            window.removeEventListener("resize", this.refresh),
                            this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                            this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh),
                            this.mutationsObserver_ = null,
                            this.mutationEventsAdded_ = !1,
                            this.connected_ = !1)
                    },
                    e.prototype.onTransitionEnd_ = function(e) {
                        var t = e.propertyName,
                            i = void 0 === t ? "" : t;
                        Li.some(function(e) {
                            return !!~i.indexOf(e)
                        }) && this.refresh()
                    },
                    e.getInstance = function() {
                        return this.instance_ || (this.instance_ = new e),
                            this.instance_
                    },
                    e.instance_ = null,
                    e
            }(),
            $i = function(e, t) {
                for (var i = 0, n = Object.keys(t); i < n.length; i++) {
                    var o = n[i];
                    Object.defineProperty(e, o, {
                        value: t[o],
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    })
                }
                return e
            },
            Mi = function(e) {
                return e && e.ownerDocument && e.ownerDocument.defaultView || Di
            },
            Pi = Fi(0, 0, 0, 0);

        function Hi(e) {
            return parseFloat(e) || 0
        }

        function qi(i) {
            for (var e = [], t = 1; t < arguments.length; t++)
                e[t - 1] = arguments[t];
            return e.reduce(function(e, t) {
                return e + Hi(i["border-" + t + "-width"])
            }, 0)
        }
        var Wi = "undefined" != typeof SVGGraphicsElement ? function(e) {
                return e instanceof Mi(e).SVGGraphicsElement
            } :
            function(e) {
                return e instanceof Mi(e).SVGElement && "function" == typeof e.getBBox
            };

        function Ri(e) {
            return Oi ? Wi(e) ? Fi(0, 0, (t = e.getBBox()).width, t.height) : function(e) {
                var t = e.clientWidth,
                    i = e.clientHeight;
                if (!t && !i)
                    return Pi;
                var n = Mi(e).getComputedStyle(e),
                    o = function(e) {
                        for (var t = {}, i = 0, n = ["top", "right", "bottom", "left"]; i < n.length; i++) {
                            var o = n[i],
                                r = e["padding-" + o];
                            t[o] = Hi(r)
                        }
                        return t
                    }(n),
                    r = o.left + o.right,
                    s = o.top + o.bottom,
                    a = Hi(n.width),
                    l = Hi(n.height);
                if ("border-box" === n.boxSizing && (Math.round(a + r) !== t && (a -= qi(n, "left", "right") + r),
                        Math.round(l + s) !== i && (l -= qi(n, "top", "bottom") + s)),
                    e !== Mi(e).document.documentElement) {
                    var c = Math.round(a + r) - t,
                        d = Math.round(l + s) - i;
                    1 !== Math.abs(c) && (a -= c),
                        1 !== Math.abs(d) && (l -= d)
                }
                return Fi(o.left, o.top, a, l)
            }(e) : Pi;
            var t
        }

        function Fi(e, t, i, n) {
            return {
                x: e,
                y: t,
                width: i,
                height: n
            }
        }
        var zi = function() {
                function e(e) {
                    this.broadcastWidth = 0,
                        this.broadcastHeight = 0,
                        this.contentRect_ = Fi(0, 0, 0, 0),
                        this.target = e
                }
                return e.prototype.isActive = function() {
                        var e = Ri(this.target);
                        return (this.contentRect_ = e).width !== this.broadcastWidth || e.height !== this.broadcastHeight
                    },
                    e.prototype.broadcastRect = function() {
                        var e = this.contentRect_;
                        return this.broadcastWidth = e.width,
                            this.broadcastHeight = e.height,
                            e
                    },
                    e
            }(),
            Bi = function(e, t) {
                var i, n, o, r, s, a, l, c = (n = (i = t).x,
                    o = i.y,
                    r = i.width,
                    s = i.height,
                    a = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object,
                    l = Object.create(a.prototype),
                    $i(l, {
                        x: n,
                        y: o,
                        width: r,
                        height: s,
                        top: o,
                        right: n + r,
                        bottom: s + o,
                        left: n
                    }),
                    l);
                $i(this, {
                    target: e,
                    contentRect: c
                })
            },
            Ui = function() {
                function e(e, t, i) {
                    if (this.activeObservations_ = [],
                        this.observations_ = new Ai,
                        "function" != typeof e)
                        throw new TypeError("The callback provided as parameter 1 is not a function.");
                    this.callback_ = e,
                        this.controller_ = t,
                        this.callbackCtx_ = i
                }
                return e.prototype.observe = function(e) {
                        if (!arguments.length)
                            throw new TypeError("1 argument required, but only 0 present.");
                        if ("undefined" != typeof Element && Element instanceof Object) {
                            if (!(e instanceof Mi(e).Element))
                                throw new TypeError('parameter 1 is not of type "Element".');
                            var t = this.observations_;
                            t.has(e) || (t.set(e, new zi(e)),
                                this.controller_.addObserver(this),
                                this.controller_.refresh())
                        }
                    },
                    e.prototype.unobserve = function(e) {
                        if (!arguments.length)
                            throw new TypeError("1 argument required, but only 0 present.");
                        if ("undefined" != typeof Element && Element instanceof Object) {
                            if (!(e instanceof Mi(e).Element))
                                throw new TypeError('parameter 1 is not of type "Element".');
                            var t = this.observations_;
                            t.has(e) && (t.delete(e),
                                t.size || this.controller_.removeObserver(this))
                        }
                    },
                    e.prototype.disconnect = function() {
                        this.clearActive(),
                            this.observations_.clear(),
                            this.controller_.removeObserver(this)
                    },
                    e.prototype.gatherActive = function() {
                        var t = this;
                        this.clearActive(),
                            this.observations_.forEach(function(e) {
                                e.isActive() && t.activeObservations_.push(e)
                            })
                    },
                    e.prototype.broadcastActive = function() {
                        if (this.hasActive()) {
                            var e = this.callbackCtx_,
                                t = this.activeObservations_.map(function(e) {
                                    return new Bi(e.target, e.broadcastRect())
                                });
                            this.callback_.call(e, t, e),
                                this.clearActive()
                        }
                    },
                    e.prototype.clearActive = function() {
                        this.activeObservations_.splice(0)
                    },
                    e.prototype.hasActive = function() {
                        return 0 < this.activeObservations_.length
                    },
                    e
            }(),
            Vi = "undefined" != typeof WeakMap ? new WeakMap : new Ai,
            Yi = function e(t) {
                if (!(this instanceof e))
                    throw new TypeError("Cannot call a class as a function.");
                if (!arguments.length)
                    throw new TypeError("1 argument required, but only 0 present.");
                var i = ji.getInstance(),
                    n = new Ui(t, i, this);
                Vi.set(this, n)
            };
        ["observe", "unobserve", "disconnect"].forEach(function(t) {
            Yi.prototype[t] = function() {
                var e;
                return (e = Vi.get(this))[t].apply(e, arguments)
            }
        });
        var Xi = void 0 !== Di.ResizeObserver ? Di.ResizeObserver : Yi,
            Qi = !("undefined" == typeof window || !window.document || !window.document.createElement),
            Ki = function() {
                function l(e, t) {
                    var r = this;
                    this.onScroll = function() {
                            r.scrollXTicking || (window.requestAnimationFrame(r.scrollX),
                                    r.scrollXTicking = !0),
                                r.scrollYTicking || (window.requestAnimationFrame(r.scrollY),
                                    r.scrollYTicking = !0)
                        },
                        this.scrollX = function() {
                            r.axis.x.isOverflowing && (r.showScrollbar("x"),
                                    r.positionScrollbar("x")),
                                r.scrollXTicking = !1
                        },
                        this.scrollY = function() {
                            r.axis.y.isOverflowing && (r.showScrollbar("y"),
                                    r.positionScrollbar("y")),
                                r.scrollYTicking = !1
                        },
                        this.onMouseEnter = function() {
                            r.showScrollbar("x"),
                                r.showScrollbar("y")
                        },
                        this.onMouseMove = function(e) {
                            r.mouseX = e.clientX,
                                r.mouseY = e.clientY,
                                (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseMoveForAxis("x"),
                                (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseMoveForAxis("y")
                        },
                        this.onMouseLeave = function() {
                            r.onMouseMove.cancel(),
                                (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseLeaveForAxis("x"),
                                (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseLeaveForAxis("y"),
                                r.mouseX = -1,
                                r.mouseY = -1
                        },
                        this.onWindowResize = function() {
                            r.scrollbarWidth = yt(),
                                r.hideNativeScrollbar()
                        },
                        this.hideScrollbars = function() {
                            r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect(),
                                r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect(),
                                r.isWithinBounds(r.axis.y.track.rect) || (r.axis.y.scrollbar.el.classList.remove(r.classNames.visible),
                                    r.axis.y.isVisible = !1),
                                r.isWithinBounds(r.axis.x.track.rect) || (r.axis.x.scrollbar.el.classList.remove(r.classNames.visible),
                                    r.axis.x.isVisible = !1)
                        },
                        this.onPointerEvent = function(e) {
                            var t, i;
                            r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect(),
                                r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect(),
                                (r.axis.x.isOverflowing || r.axis.x.forceVisible) && (i = r.isWithinBounds(r.axis.x.scrollbar.rect)),
                                (r.axis.y.isOverflowing || r.axis.y.forceVisible) && (t = r.isWithinBounds(r.axis.y.scrollbar.rect)),
                                (t || i) && (e.preventDefault(),
                                    e.stopPropagation(),
                                    "mousedown" === e.type && (t && r.onDragStart(e, "y"),
                                        i && r.onDragStart(e, "x")))
                        },
                        this.drag = function(e) {
                            var t = r.axis[r.draggedAxis].track,
                                i = t.rect[r.axis[r.draggedAxis].sizeAttr],
                                n = r.axis[r.draggedAxis].scrollbar;
                            e.preventDefault(),
                                e.stopPropagation();
                            var o = (("y" === r.draggedAxis ? e.pageY : e.pageX) - t.rect[r.axis[r.draggedAxis].offsetAttr] - r.axis[r.draggedAxis].dragOffset) / t.rect[r.axis[r.draggedAxis].sizeAttr] * r.contentWrapperEl[r.axis[r.draggedAxis].scrollSizeAttr];
                            "x" === r.draggedAxis && (o = r.isRtl && l.getRtlHelpers().isRtlScrollbarInverted ? o - (i + n.size) : o,
                                    o = r.isRtl && l.getRtlHelpers().isRtlScrollingInverted ? -o : o),
                                r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = o
                        },
                        this.onEndDrag = function(e) {
                            e.preventDefault(),
                                e.stopPropagation(),
                                r.el.classList.remove(r.classNames.dragging),
                                document.removeEventListener("mousemove", r.drag),
                                document.removeEventListener("mouseup", r.onEndDrag)
                        },
                        this.el = e,
                        this.flashTimeout,
                        this.contentEl,
                        this.contentWrapperEl,
                        this.offsetEl,
                        this.maskEl,
                        this.globalObserver,
                        this.mutationObserver,
                        this.resizeObserver,
                        this.scrollbarWidth,
                        this.minScrollbarWidth = 20,
                        this.options = Object.assign({}, l.defaultOptions, t),
                        this.classNames = Object.assign({}, l.defaultOptions.classNames, this.options.classNames),
                        this.isRtl,
                        this.axis = {
                            x: {
                                scrollOffsetAttr: "scrollLeft",
                                sizeAttr: "width",
                                scrollSizeAttr: "scrollWidth",
                                offsetAttr: "left",
                                overflowAttr: "overflowX",
                                dragOffset: 0,
                                isOverflowing: !0,
                                isVisible: !1,
                                forceVisible: !1,
                                track: {},
                                scrollbar: {}
                            },
                            y: {
                                scrollOffsetAttr: "scrollTop",
                                sizeAttr: "height",
                                scrollSizeAttr: "scrollHeight",
                                offsetAttr: "top",
                                overflowAttr: "overflowY",
                                dragOffset: 0,
                                isOverflowing: !0,
                                isVisible: !1,
                                forceVisible: !1,
                                track: {},
                                scrollbar: {}
                            }
                        },
                        this.el.SimpleBar || (this.recalculate = Mt(this.recalculate.bind(this), 64),
                            this.onMouseMove = Mt(this.onMouseMove.bind(this), 64),
                            this.hideScrollbars = Zt(this.hideScrollbars.bind(this), this.options.timeout),
                            this.onWindowResize = Zt(this.onWindowResize.bind(this), 64, {
                                leading: !0
                            }),
                            l.getRtlHelpers = Ci(l.getRtlHelpers),
                            this.init())
                }
                l.getRtlHelpers = function() {
                        var e = document.createElement("div");
                        e.innerHTML = '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
                        var t = e.firstElementChild;
                        document.body.appendChild(t);
                        var i = t.firstElementChild;
                        t.scrollLeft = 0;
                        var n = l.getOffset(t),
                            o = l.getOffset(i);
                        t.scrollLeft = 999;
                        var r = l.getOffset(i);
                        return {
                            isRtlScrollingInverted: n.left !== o.left && o.left - r.left != 0,
                            isRtlScrollbarInverted: n.left !== o.left
                        }
                    },
                    l.initHtmlApi = function() {
                        this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this),
                            "undefined" != typeof MutationObserver && (this.globalObserver = new MutationObserver(function(e) {
                                    e.forEach(function(e) {
                                        Array.prototype.forEach.call(e.addedNodes, function(e) {
                                                1 === e.nodeType && (e.hasAttribute("data-simplebar") ? !e.SimpleBar && new l(e, l.getElOptions(e)) : Array.prototype.forEach.call(e.querySelectorAll("[data-simplebar]"), function(e) {
                                                    !e.SimpleBar && new l(e, l.getElOptions(e))
                                                }))
                                            }),
                                            Array.prototype.forEach.call(e.removedNodes, function(e) {
                                                1 === e.nodeType && (e.hasAttribute("data-simplebar") ? e.SimpleBar && e.SimpleBar.unMount() : Array.prototype.forEach.call(e.querySelectorAll("[data-simplebar]"), function(e) {
                                                    e.SimpleBar && e.SimpleBar.unMount()
                                                }))
                                            })
                                    })
                                }),
                                this.globalObserver.observe(document, {
                                    childList: !0,
                                    subtree: !0
                                })),
                            "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(this.initDOMLoadedElements) : (document.addEventListener("DOMContentLoaded", this.initDOMLoadedElements),
                                window.addEventListener("load", this.initDOMLoadedElements))
                    },
                    l.getElOptions = function(e) {
                        return Array.prototype.reduce.call(e.attributes, function(e, t) {
                            var i = t.name.match(/data-simplebar-(.+)/);
                            if (i) {
                                var n = i[1].replace(/\W+(.)/g, function(e, t) {
                                    return t.toUpperCase()
                                });
                                switch (t.value) {
                                    case "true":
                                        e[n] = !0;
                                        break;
                                    case "false":
                                        e[n] = !1;
                                        break;
                                    case void 0:
                                        e[n] = !0;
                                        break;
                                    default:
                                        e[n] = t.value
                                }
                            }
                            return e
                        }, {})
                    },
                    l.removeObserver = function() {
                        this.globalObserver.disconnect()
                    },
                    l.initDOMLoadedElements = function() {
                        document.removeEventListener("DOMContentLoaded", this.initDOMLoadedElements),
                            window.removeEventListener("load", this.initDOMLoadedElements),
                            Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"), function(e) {
                                e.SimpleBar || new l(e, l.getElOptions(e))
                            })
                    },
                    l.getOffset = function(e) {
                        var t = e.getBoundingClientRect();
                        return {
                            top: t.top + (window.pageYOffset || document.documentElement.scrollTop),
                            left: t.left + (window.pageXOffset || document.documentElement.scrollLeft)
                        }
                    };
                var e = l.prototype;
                return e.init = function() {
                        this.el.SimpleBar = this,
                            Qi && (this.initDOM(),
                                this.scrollbarWidth = yt(),
                                this.recalculate(),
                                this.initListeners())
                    },
                    e.initDOM = function() {
                        var t = this;
                        if (Array.prototype.filter.call(this.el.children, function(e) {
                                return e.classList.contains(t.classNames.wrapper)
                            }).length)
                            this.wrapperEl = this.el.querySelector("." + this.classNames.wrapper),
                            this.contentWrapperEl = this.el.querySelector("." + this.classNames.contentWrapper),
                            this.offsetEl = this.el.querySelector("." + this.classNames.offset),
                            this.maskEl = this.el.querySelector("." + this.classNames.mask),
                            this.contentEl = this.el.querySelector("." + this.classNames.contentEl),
                            this.placeholderEl = this.el.querySelector("." + this.classNames.placeholder),
                            this.heightAutoObserverWrapperEl = this.el.querySelector("." + this.classNames.heightAutoObserverWrapperEl),
                            this.heightAutoObserverEl = this.el.querySelector("." + this.classNames.heightAutoObserverEl),
                            this.axis.x.track.el = this.el.querySelector("." + this.classNames.track + "." + this.classNames.horizontal),
                            this.axis.y.track.el = this.el.querySelector("." + this.classNames.track + "." + this.classNames.vertical);
                        else {
                            for (this.wrapperEl = document.createElement("div"),
                                this.contentWrapperEl = document.createElement("div"),
                                this.offsetEl = document.createElement("div"),
                                this.maskEl = document.createElement("div"),
                                this.contentEl = document.createElement("div"),
                                this.placeholderEl = document.createElement("div"),
                                this.heightAutoObserverWrapperEl = document.createElement("div"),
                                this.heightAutoObserverEl = document.createElement("div"),
                                this.wrapperEl.classList.add(this.classNames.wrapper),
                                this.contentWrapperEl.classList.add(this.classNames.contentWrapper),
                                this.offsetEl.classList.add(this.classNames.offset),
                                this.maskEl.classList.add(this.classNames.mask),
                                this.contentEl.classList.add(this.classNames.contentEl),
                                this.placeholderEl.classList.add(this.classNames.placeholder),
                                this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl),
                                this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl); this.el.firstChild;)
                                this.contentEl.appendChild(this.el.firstChild);
                            this.contentWrapperEl.appendChild(this.contentEl),
                                this.offsetEl.appendChild(this.contentWrapperEl),
                                this.maskEl.appendChild(this.offsetEl),
                                this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl),
                                this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
                                this.wrapperEl.appendChild(this.maskEl),
                                this.wrapperEl.appendChild(this.placeholderEl),
                                this.el.appendChild(this.wrapperEl)
                        }
                        if (!this.axis.x.track.el || !this.axis.y.track.el) {
                            var e = document.createElement("div"),
                                i = document.createElement("div");
                            e.classList.add(this.classNames.track),
                                i.classList.add(this.classNames.scrollbar),
                                e.appendChild(i),
                                this.axis.x.track.el = e.cloneNode(!0),
                                this.axis.x.track.el.classList.add(this.classNames.horizontal),
                                this.axis.y.track.el = e.cloneNode(!0),
                                this.axis.y.track.el.classList.add(this.classNames.vertical),
                                this.el.appendChild(this.axis.x.track.el),
                                this.el.appendChild(this.axis.y.track.el)
                        }
                        this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector("." + this.classNames.scrollbar),
                            this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector("." + this.classNames.scrollbar),
                            this.options.autoHide || (this.axis.x.scrollbar.el.classList.add(this.classNames.visible),
                                this.axis.y.scrollbar.el.classList.add(this.classNames.visible)),
                            this.el.setAttribute("data-simplebar", "init")
                    },
                    e.initListeners = function() {
                        var t = this;
                        this.options.autoHide && this.el.addEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick", "touchstart", "touchend", "touchmove"].forEach(function(e) {
                                t.el.addEventListener(e, t.onPointerEvent, !0)
                            }),
                            this.el.addEventListener("mousemove", this.onMouseMove),
                            this.el.addEventListener("mouseleave", this.onMouseLeave),
                            this.contentWrapperEl.addEventListener("scroll", this.onScroll),
                            window.addEventListener("resize", this.onWindowResize),
                            this.resizeObserver = new Xi(this.recalculate),
                            this.resizeObserver.observe(this.el),
                            this.resizeObserver.observe(this.contentEl)
                    },
                    e.recalculate = function() {
                        var e = this.heightAutoObserverEl.offsetHeight <= 1,
                            t = this.heightAutoObserverEl.offsetWidth <= 1;
                        this.elStyles = window.getComputedStyle(this.el),
                            this.isRtl = "rtl" === this.elStyles.direction,
                            this.contentEl.style.padding = this.elStyles.paddingTop + " " + this.elStyles.paddingRight + " " + this.elStyles.paddingBottom + " " + this.elStyles.paddingLeft,
                            this.wrapperEl.style.margin = "-" + this.elStyles.paddingTop + " -" + this.elStyles.paddingRight + " -" + this.elStyles.paddingBottom + " -" + this.elStyles.paddingLeft,
                            this.contentWrapperEl.style.height = e ? "auto" : "100%",
                            this.placeholderEl.style.width = t ? this.contentEl.offsetWidth + "px" : "auto",
                            this.placeholderEl.style.height = this.contentEl.scrollHeight + "px",
                            this.axis.x.isOverflowing = this.contentWrapperEl.scrollWidth > this.contentWrapperEl.offsetWidth,
                            this.axis.y.isOverflowing = this.contentWrapperEl.scrollHeight > this.contentWrapperEl.offsetHeight,
                            this.axis.x.isOverflowing = "hidden" !== this.elStyles.overflowX && this.axis.x.isOverflowing,
                            this.axis.y.isOverflowing = "hidden" !== this.elStyles.overflowY && this.axis.y.isOverflowing,
                            this.axis.x.forceVisible = "x" === this.options.forceVisible || !0 === this.options.forceVisible,
                            this.axis.y.forceVisible = "y" === this.options.forceVisible || !0 === this.options.forceVisible,
                            this.hideNativeScrollbar(),
                            this.axis.x.track.rect = this.axis.x.track.el.getBoundingClientRect(),
                            this.axis.y.track.rect = this.axis.y.track.el.getBoundingClientRect(),
                            this.axis.x.scrollbar.size = this.getScrollbarSize("x"),
                            this.axis.y.scrollbar.size = this.getScrollbarSize("y"),
                            this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + "px",
                            this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + "px",
                            this.positionScrollbar("x"),
                            this.positionScrollbar("y"),
                            this.toggleTrackVisibility("x"),
                            this.toggleTrackVisibility("y")
                    },
                    e.getScrollbarSize = function(e) {
                        void 0 === e && (e = "y");
                        var t, i = this.scrollbarWidth ? this.contentWrapperEl[this.axis[e].scrollSizeAttr] : this.contentWrapperEl[this.axis[e].scrollSizeAttr] - this.minScrollbarWidth,
                            n = this.axis[e].track.rect[this.axis[e].sizeAttr];
                        if (this.axis[e].isOverflowing) {
                            var o = n / i;
                            return t = Math.max(~~(o * n), this.options.scrollbarMinSize),
                                this.options.scrollbarMaxSize && (t = Math.min(t, this.options.scrollbarMaxSize)),
                                t
                        }
                    },
                    e.positionScrollbar = function(e) {
                        void 0 === e && (e = "y");
                        var t = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
                            i = this.axis[e].track.rect[this.axis[e].sizeAttr],
                            n = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                            o = this.axis[e].scrollbar,
                            r = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                            s = (r = "x" === e && this.isRtl && l.getRtlHelpers().isRtlScrollingInverted ? -r : r) / (t - n),
                            a = ~~((i - o.size) * s);
                        a = "x" === e && this.isRtl && l.getRtlHelpers().isRtlScrollbarInverted ? a + (i - o.size) : a,
                            o.el.style.transform = "x" === e ? "translate3d(" + a + "px, 0, 0)" : "translate3d(0, " + a + "px, 0)"
                    },
                    e.toggleTrackVisibility = function(e) {
                        void 0 === e && (e = "y");
                        var t = this.axis[e].track.el,
                            i = this.axis[e].scrollbar.el;
                        this.axis[e].isOverflowing || this.axis[e].forceVisible ? (t.style.visibility = "visible",
                                this.contentWrapperEl.style[this.axis[e].overflowAttr] = "scroll") : (t.style.visibility = "hidden",
                                this.contentWrapperEl.style[this.axis[e].overflowAttr] = "hidden"),
                            this.axis[e].isOverflowing ? i.style.display = "block" : i.style.display = "none"
                    },
                    e.hideNativeScrollbar = function() {
                        if (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-" + (this.scrollbarWidth || this.minScrollbarWidth) + "px" : 0,
                            this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-" + (this.scrollbarWidth || this.minScrollbarWidth) + "px" : 0, !this.scrollbarWidth) {
                            var e = [this.isRtl ? "paddingLeft" : "paddingRight"];
                            this.contentWrapperEl.style[e] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? this.minScrollbarWidth + "px" : 0,
                                this.contentWrapperEl.style.paddingBottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? this.minScrollbarWidth + "px" : 0
                        }
                    },
                    e.onMouseMoveForAxis = function(e) {
                        void 0 === e && (e = "y"),
                            this.axis[e].track.rect = this.axis[e].track.el.getBoundingClientRect(),
                            this.axis[e].scrollbar.rect = this.axis[e].scrollbar.el.getBoundingClientRect(),
                            this.isWithinBounds(this.axis[e].scrollbar.rect) ? this.axis[e].scrollbar.el.classList.add(this.classNames.hover) : this.axis[e].scrollbar.el.classList.remove(this.classNames.hover),
                            this.isWithinBounds(this.axis[e].track.rect) ? (this.showScrollbar(e),
                                this.axis[e].track.el.classList.add(this.classNames.hover)) : this.axis[e].track.el.classList.remove(this.classNames.hover)
                    },
                    e.onMouseLeaveForAxis = function(e) {
                        void 0 === e && (e = "y"),
                            this.axis[e].track.el.classList.remove(this.classNames.hover),
                            this.axis[e].scrollbar.el.classList.remove(this.classNames.hover)
                    },
                    e.showScrollbar = function(e) {
                        void 0 === e && (e = "y");
                        var t = this.axis[e].scrollbar.el;
                        this.axis[e].isVisible || (t.classList.add(this.classNames.visible),
                                this.axis[e].isVisible = !0),
                            this.options.autoHide && this.hideScrollbars()
                    },
                    e.onDragStart = function(e, t) {
                        void 0 === t && (t = "y");
                        var i = this.axis[t].scrollbar.el,
                            n = "y" === t ? e.pageY : e.pageX;
                        this.axis[t].dragOffset = n - i.getBoundingClientRect()[this.axis[t].offsetAttr],
                            this.draggedAxis = t,
                            this.el.classList.add(this.classNames.dragging),
                            document.addEventListener("mousemove", this.drag),
                            document.addEventListener("mouseup", this.onEndDrag)
                    },
                    e.getContentElement = function() {
                        return this.contentEl
                    },
                    e.getScrollElement = function() {
                        return this.contentWrapperEl
                    },
                    e.removeListeners = function() {
                        var t = this;
                        this.options.autoHide && this.el.removeEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick", "touchstart", "touchend", "touchmove"].forEach(function(e) {
                                t.el.removeEventListener(e, t.onPointerEvent)
                            }),
                            this.el.removeEventListener("mousemove", this.onMouseMove),
                            this.el.removeEventListener("mouseleave", this.onMouseLeave),
                            this.contentWrapperEl.removeEventListener("scroll", this.onScroll),
                            window.removeEventListener("resize", this.onWindowResize),
                            this.mutationObserver && this.mutationObserver.disconnect(),
                            this.resizeObserver.disconnect(),
                            this.recalculate.cancel(),
                            this.onMouseMove.cancel(),
                            this.hideScrollbars.cancel(),
                            this.onWindowResize.cancel()
                    },
                    e.unMount = function() {
                        this.removeListeners(),
                            this.el.SimpleBar = null
                    },
                    e.isChildNode = function(e) {
                        return null !== e && (e === this.el || this.isChildNode(e.parentNode))
                    },
                    e.isWithinBounds = function(e) {
                        return this.mouseX >= e.left && this.mouseX <= e.left + e.width && this.mouseY >= e.top && this.mouseY <= e.top + e.height
                    },
                    l
            }();
        return Ki.defaultOptions = {
                autoHide: !0,
                forceVisible: !1,
                classNames: {
                    contentEl: "simplebar-content",
                    contentWrapper: "simplebar-content-wrapper",
                    offset: "simplebar-offset",
                    mask: "simplebar-mask",
                    wrapper: "simplebar-wrapper",
                    placeholder: "simplebar-placeholder",
                    scrollbar: "simplebar-scrollbar",
                    track: "simplebar-track",
                    heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
                    heightAutoObserverEl: "simplebar-height-auto-observer",
                    visible: "simplebar-visible",
                    horizontal: "simplebar-horizontal",
                    vertical: "simplebar-vertical",
                    hover: "simplebar-hover",
                    dragging: "simplebar-dragging"
                },
                scrollbarMinSize: 25,
                scrollbarMaxSize: 0,
                timeout: 1e3
            },
            Qi && Ki.initHtmlApi(),
            Ki
    }),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(
        function(c) {
            "use strict";
            var o, r = window.Slick || {};
            (o = 0,
                r = function(e, t) {
                    var i, n = this;
                    n.defaults = {
                            accessibility: !0,
                            adaptiveHeight: !1,
                            appendArrows: c(e),
                            appendDots: c(e),
                            arrows: !0,
                            asNavFor: null,
                            prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                            nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                            autoplay: !1,
                            autoplaySpeed: 3e3,
                            centerMode: !1,
                            centerPadding: "50px",
                            cssEase: "ease",
                            customPaging: function(e, t) {
                                return c('<button type="button" />').text(t + 1)
                            },
                            dots: !1,
                            dotsClass: "slick-dots",
                            draggable: !0,
                            easing: "linear",
                            edgeFriction: .35,
                            fade: !1,
                            focusOnSelect: !1,
                            focusOnChange: !1,
                            infinite: !0,
                            initialSlide: 0,
                            lazyLoad: "ondemand",
                            mobileFirst: !1,
                            pauseOnHover: !0,
                            pauseOnFocus: !0,
                            pauseOnDotsHover: !1,
                            respondTo: "window",
                            responsive: null,
                            rows: 1,
                            rtl: !1,
                            slide: "",
                            slidesPerRow: 1,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            speed: 500,
                            swipe: !0,
                            swipeToSlide: !1,
                            touchMove: !0,
                            touchThreshold: 5,
                            useCSS: !0,
                            useTransform: !0,
                            variableWidth: !1,
                            vertical: !1,
                            verticalSwiping: !1,
                            waitForAnimate: !0,
                            zIndex: 1e3
                        },
                        n.initials = {
                            animating: !1,
                            dragging: !1,
                            autoPlayTimer: null,
                            currentDirection: 0,
                            currentLeft: null,
                            currentSlide: 0,
                            direction: 1,
                            $dots: null,
                            listWidth: null,
                            listHeight: null,
                            loadIndex: 0,
                            $nextArrow: null,
                            $prevArrow: null,
                            scrolling: !1,
                            slideCount: null,
                            slideWidth: null,
                            $slideTrack: null,
                            $slides: null,
                            sliding: !1,
                            slideOffset: 0,
                            swipeLeft: null,
                            swiping: !1,
                            $list: null,
                            touchObject: {},
                            transformsEnabled: !1,
                            unslicked: !1
                        },
                        c.extend(n, n.initials),
                        n.activeBreakpoint = null,
                        n.animType = null,
                        n.animProp = null,
                        n.breakpoints = [],
                        n.breakpointSettings = [],
                        n.cssTransitions = !1,
                        n.focussed = !1,
                        n.interrupted = !1,
                        n.hidden = "hidden",
                        n.paused = !0,
                        n.positionProp = null,
                        n.respondTo = null,
                        n.rowCount = 1,
                        n.shouldClick = !0,
                        n.$slider = c(e),
                        n.$slidesCache = null,
                        n.transformType = null,
                        n.transitionType = null,
                        n.visibilityChange = "visibilitychange",
                        n.windowWidth = 0,
                        n.windowTimer = null,
                        i = c(e).data("slick") || {},
                        n.options = c.extend({}, n.defaults, t, i),
                        n.currentSlide = n.options.initialSlide,
                        n.originalSettings = n.options,
                        void 0 !== document.mozHidden ? (n.hidden = "mozHidden",
                            n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden",
                            n.visibilityChange = "webkitvisibilitychange"),
                        n.autoPlay = c.proxy(n.autoPlay, n),
                        n.autoPlayClear = c.proxy(n.autoPlayClear, n),
                        n.autoPlayIterator = c.proxy(n.autoPlayIterator, n),
                        n.changeSlide = c.proxy(n.changeSlide, n),
                        n.clickHandler = c.proxy(n.clickHandler, n),
                        n.selectHandler = c.proxy(n.selectHandler, n),
                        n.setPosition = c.proxy(n.setPosition, n),
                        n.swipeHandler = c.proxy(n.swipeHandler, n),
                        n.dragHandler = c.proxy(n.dragHandler, n),
                        n.keyHandler = c.proxy(n.keyHandler, n),
                        n.instanceUid = o++,
                        n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
                        n.registerBreakpoints(),
                        n.init(!0)
                }
            ).prototype.activateADA = function() {
                    this.$slideTrack.find(".slick-active").attr({
                        "aria-hidden": "false"
                    }).find("a, input, button, select").attr({
                        tabindex: "0"
                    })
                },
                r.prototype.addSlide = r.prototype.slickAdd = function(e, t, i) {
                    var n = this;
                    if ("boolean" == typeof t)
                        i = t,
                        t = null;
                    else if (t < 0 || t >= n.slideCount)
                        return !1;
                    n.unload(),
                        "number" == typeof t ? 0 === t && 0 === n.$slides.length ? c(e).appendTo(n.$slideTrack) : i ? c(e).insertBefore(n.$slides.eq(t)) : c(e).insertAfter(n.$slides.eq(t)) : !0 === i ? c(e).prependTo(n.$slideTrack) : c(e).appendTo(n.$slideTrack),
                        n.$slides = n.$slideTrack.children(this.options.slide),
                        n.$slideTrack.children(this.options.slide).detach(),
                        n.$slideTrack.append(n.$slides),
                        n.$slides.each(function(e, t) {
                            c(t).attr("data-slick-index", e)
                        }),
                        n.$slidesCache = n.$slides,
                        n.reinit()
                },
                r.prototype.animateHeight = function() {
                    if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
                        var e = this.$slides.eq(this.currentSlide).outerHeight(!0);
                        this.$list.animate({
                            height: e
                        }, this.options.speed)
                    }
                },
                r.prototype.animateSlide = function(e, t) {
                    var i = {},
                        n = this;
                    n.animateHeight(), !0 === n.options.rtl && !1 === n.options.vertical && (e = -e), !1 === n.transformsEnabled ? !1 === n.options.vertical ? n.$slideTrack.animate({
                        left: e
                    }, n.options.speed, n.options.easing, t) : n.$slideTrack.animate({
                        top: e
                    }, n.options.speed, n.options.easing, t) : !1 === n.cssTransitions ? (!0 === n.options.rtl && (n.currentLeft = -n.currentLeft),
                        c({
                            animStart: n.currentLeft
                        }).animate({
                            animStart: e
                        }, {
                            duration: n.options.speed,
                            easing: n.options.easing,
                            step: function(e) {
                                e = Math.ceil(e), !1 === n.options.vertical ? i[n.animType] = "translate(" + e + "px, 0px)" : i[n.animType] = "translate(0px," + e + "px)",
                                    n.$slideTrack.css(i)
                            },
                            complete: function() {
                                t && t.call()
                            }
                        })) : (n.applyTransition(),
                        e = Math.ceil(e), !1 === n.options.vertical ? i[n.animType] = "translate3d(" + e + "px, 0px, 0px)" : i[n.animType] = "translate3d(0px," + e + "px, 0px)",
                        n.$slideTrack.css(i),
                        t && setTimeout(function() {
                            n.disableTransition(),
                                t.call()
                        }, n.options.speed))
                },
                r.prototype.getNavTarget = function() {
                    var e = this.options.asNavFor;
                    return e && null !== e && (e = c(e).not(this.$slider)),
                        e
                },
                r.prototype.asNavFor = function(t) {
                    var e = this.getNavTarget();
                    null !== e && "object" == typeof e && e.each(function() {
                        var e = c(this).slick("getSlick");
                        e.unslicked || e.slideHandler(t, !0)
                    })
                },
                r.prototype.applyTransition = function(e) {
                    var t = this,
                        i = {};
                    !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
                },
                r.prototype.autoPlay = function() {
                    this.autoPlayClear(),
                        this.slideCount > this.options.slidesToShow && (this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed))
                },
                r.prototype.autoPlayClear = function() {
                    this.autoPlayTimer && clearInterval(this.autoPlayTimer)
                },
                r.prototype.autoPlayIterator = function() {
                    var e = this,
                        t = e.currentSlide + e.options.slidesToScroll;
                    e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll,
                            e.currentSlide - 1 == 0 && (e.direction = 1))),
                        e.slideHandler(t))
                },
                r.prototype.buildArrows = function() {
                    var e = this;
                    !0 === e.options.arrows && (e.$prevArrow = c(e.options.prevArrow).addClass("slick-arrow"),
                        e.$nextArrow = c(e.options.nextArrow).addClass("slick-arrow"),
                        e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                            e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                            e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows),
                            e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
                            "aria-disabled": "true",
                            tabindex: "-1"
                        }))
                },
                r.prototype.buildDots = function() {
                    var e, t;
                    if (!0 === this.options.dots) {
                        for (this.$slider.addClass("slick-dotted"),
                            t = c("<ul />").addClass(this.options.dotsClass),
                            e = 0; e <= this.getDotCount(); e += 1)
                            t.append(c("<li />").append(this.options.customPaging.call(this, this, e)));
                        this.$dots = t.appendTo(this.options.appendDots),
                            this.$dots.find("li").first().addClass("slick-active")
                    }
                },
                r.prototype.buildOut = function() {
                    var e = this;
                    e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
                        e.slideCount = e.$slides.length,
                        e.$slides.each(function(e, t) {
                            c(t).attr("data-slick-index", e).data("originalStyling", c(t).attr("style") || "")
                        }),
                        e.$slider.addClass("slick-slider"),
                        e.$slideTrack = 0 === e.slideCount ? c('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(),
                        e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(),
                        e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1),
                        c("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
                        e.setupInfinite(),
                        e.buildArrows(),
                        e.buildDots(),
                        e.updateDots(),
                        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable")
                },
                r.prototype.buildRows = function() {
                    var e, t, i, n, o, r, s, a = this;
                    if (n = document.createDocumentFragment(),
                        r = a.$slider.children(),
                        1 < a.options.rows) {
                        for (s = a.options.slidesPerRow * a.options.rows,
                            o = Math.ceil(r.length / s),
                            e = 0; e < o; e++) {
                            var l = document.createElement("div");
                            for (t = 0; t < a.options.rows; t++) {
                                var c = document.createElement("div");
                                for (i = 0; i < a.options.slidesPerRow; i++) {
                                    var d = e * s + (t * a.options.slidesPerRow + i);
                                    r.get(d) && c.appendChild(r.get(d))
                                }
                                l.appendChild(c)
                            }
                            n.appendChild(l)
                        }
                        a.$slider.empty().append(n),
                            a.$slider.children().children().children().css({
                                width: 100 / a.options.slidesPerRow + "%",
                                display: "inline-block"
                            })
                    }
                },
                r.prototype.checkResponsive = function(e, t) {
                    var i, n, o, r = this,
                        s = !1,
                        a = r.$slider.width(),
                        l = window.innerWidth || c(window).width();
                    if ("window" === r.respondTo ? o = l : "slider" === r.respondTo ? o = a : "min" === r.respondTo && (o = Math.min(l, a)),
                        r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
                        for (i in n = null,
                            r.breakpoints)
                            r.breakpoints.hasOwnProperty(i) && (!1 === r.originalSettings.mobileFirst ? o < r.breakpoints[i] && (n = r.breakpoints[i]) : o > r.breakpoints[i] && (n = r.breakpoints[i]));
                        null !== n ? null !== r.activeBreakpoint ? (n !== r.activeBreakpoint || t) && (r.activeBreakpoint = n,
                                "unslick" === r.breakpointSettings[n] ? r.unslick(n) : (r.options = c.extend({}, r.originalSettings, r.breakpointSettings[n]), !0 === e && (r.currentSlide = r.options.initialSlide),
                                    r.refresh(e)),
                                s = n) : (r.activeBreakpoint = n,
                                "unslick" === r.breakpointSettings[n] ? r.unslick(n) : (r.options = c.extend({}, r.originalSettings, r.breakpointSettings[n]), !0 === e && (r.currentSlide = r.options.initialSlide),
                                    r.refresh(e)),
                                s = n) : null !== r.activeBreakpoint && (r.activeBreakpoint = null,
                                r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide),
                                r.refresh(e),
                                s = n),
                            e || !1 === s || r.$slider.trigger("breakpoint", [r, s])
                    }
                },
                r.prototype.changeSlide = function(e, t) {
                    var i, n, o = this,
                        r = c(e.currentTarget);
                    switch (r.is("a") && e.preventDefault(),
                        r.is("li") || (r = r.closest("li")),
                        i = o.slideCount % o.options.slidesToScroll != 0 ? 0 : (o.slideCount - o.currentSlide) % o.options.slidesToScroll,
                        e.data.message) {
                        case "previous":
                            n = 0 === i ? o.options.slidesToScroll : o.options.slidesToShow - i,
                                o.slideCount > o.options.slidesToShow && o.slideHandler(o.currentSlide - n, !1, t);
                            break;
                        case "next":
                            n = 0 === i ? o.options.slidesToScroll : i,
                                o.slideCount > o.options.slidesToShow && o.slideHandler(o.currentSlide + n, !1, t);
                            break;
                        case "index":
                            var s = 0 === e.data.index ? 0 : e.data.index || r.index() * o.options.slidesToScroll;
                            o.slideHandler(o.checkNavigable(s), !1, t),
                                r.children().trigger("focus");
                            break;
                        default:
                            return
                    }
                },
                r.prototype.checkNavigable = function(e) {
                    var t, i;
                    if (i = 0,
                        e > (t = this.getNavigableIndexes())[t.length - 1])
                        e = t[t.length - 1];
                    else
                        for (var n in t) {
                            if (e < t[n]) {
                                e = i;
                                break
                            }
                            i = t[n]
                        }
                    return e
                },
                r.prototype.cleanUpEvents = function() {
                    var e = this;
                    e.options.dots && null !== e.$dots && (c("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", c.proxy(e.interrupt, e, !0)).off("mouseleave.slick", c.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)),
                        e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
                            e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
                                e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
                        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
                        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
                        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
                        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
                        e.$list.off("click.slick", e.clickHandler),
                        c(document).off(e.visibilityChange, e.visibility),
                        e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().off("click.slick", e.selectHandler),
                        c(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange),
                        c(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
                        c("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault),
                        c(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
                },
                r.prototype.cleanUpSlideEvents = function() {
                    this.$list.off("mouseenter.slick", c.proxy(this.interrupt, this, !0)),
                        this.$list.off("mouseleave.slick", c.proxy(this.interrupt, this, !1))
                },
                r.prototype.cleanUpRows = function() {
                    var e;
                    1 < this.options.rows && ((e = this.$slides.children().children()).removeAttr("style"),
                        this.$slider.empty().append(e))
                },
                r.prototype.clickHandler = function(e) {
                    !1 === this.shouldClick && (e.stopImmediatePropagation(),
                        e.stopPropagation(),
                        e.preventDefault())
                },
                r.prototype.destroy = function(e) {
                    var t = this;
                    t.autoPlayClear(),
                        t.touchObject = {},
                        t.cleanUpEvents(),
                        c(".slick-cloned", t.$slider).detach(),
                        t.$dots && t.$dots.remove(),
                        t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                            t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
                        t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
                            t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
                        t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
                                c(this).attr("style", c(this).data("originalStyling"))
                            }),
                            t.$slideTrack.children(this.options.slide).detach(),
                            t.$slideTrack.detach(),
                            t.$list.detach(),
                            t.$slider.append(t.$slides)),
                        t.cleanUpRows(),
                        t.$slider.removeClass("slick-slider"),
                        t.$slider.removeClass("slick-initialized"),
                        t.$slider.removeClass("slick-dotted"),
                        t.unslicked = !0,
                        e || t.$slider.trigger("destroy", [t])
                },
                r.prototype.disableTransition = function(e) {
                    var t = {};
                    t[this.transitionType] = "", !1 === this.options.fade ? this.$slideTrack.css(t) : this.$slides.eq(e).css(t)
                },
                r.prototype.fadeSlide = function(e, t) {
                    var i = this;
                    !1 === i.cssTransitions ? (i.$slides.eq(e).css({
                            zIndex: i.options.zIndex
                        }),
                        i.$slides.eq(e).animate({
                            opacity: 1
                        }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e),
                        i.$slides.eq(e).css({
                            opacity: 1,
                            zIndex: i.options.zIndex
                        }),
                        t && setTimeout(function() {
                            i.disableTransition(e),
                                t.call()
                        }, i.options.speed))
                },
                r.prototype.fadeSlideOut = function(e) {
                    !1 === this.cssTransitions ? this.$slides.eq(e).animate({
                        opacity: 0,
                        zIndex: this.options.zIndex - 2
                    }, this.options.speed, this.options.easing) : (this.applyTransition(e),
                        this.$slides.eq(e).css({
                            opacity: 0,
                            zIndex: this.options.zIndex - 2
                        }))
                },
                r.prototype.filterSlides = r.prototype.slickFilter = function(e) {
                    null !== e && (this.$slidesCache = this.$slides,
                        this.unload(),
                        this.$slideTrack.children(this.options.slide).detach(),
                        this.$slidesCache.filter(e).appendTo(this.$slideTrack),
                        this.reinit())
                },
                r.prototype.focusHandler = function() {
                    var i = this;
                    i.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(e) {
                        e.stopImmediatePropagation();
                        var t = c(this);
                        setTimeout(function() {
                            i.options.pauseOnFocus && (i.focussed = t.is(":focus"),
                                i.autoPlay())
                        }, 0)
                    })
                },
                r.prototype.getCurrent = r.prototype.slickCurrentSlide = function() {
                    return this.currentSlide
                },
                r.prototype.getDotCount = function() {
                    var e = this,
                        t = 0,
                        i = 0,
                        n = 0;
                    if (!0 === e.options.infinite)
                        if (e.slideCount <= e.options.slidesToShow)
                            ++n;
                        else
                            for (; t < e.slideCount;)
                                ++n,
                                t = i + e.options.slidesToScroll,
                                i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                    else if (!0 === e.options.centerMode)
                        n = e.slideCount;
                    else if (e.options.asNavFor)
                        for (; t < e.slideCount;)
                            ++n,
                            t = i + e.options.slidesToScroll,
                            i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
                    else
                        n = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
                    return n - 1
                },
                r.prototype.getLeft = function(e) {
                    var t, i, n, o, r = this,
                        s = 0;
                    return r.slideOffset = 0,
                        i = r.$slides.first().outerHeight(!0), !0 === r.options.infinite ? (r.slideCount > r.options.slidesToShow && (r.slideOffset = r.slideWidth * r.options.slidesToShow * -1,
                                o = -1, !0 === r.options.vertical && !0 === r.options.centerMode && (2 === r.options.slidesToShow ? o = -1.5 : 1 === r.options.slidesToShow && (o = -2)),
                                s = i * r.options.slidesToShow * o),
                            r.slideCount % r.options.slidesToScroll != 0 && e + r.options.slidesToScroll > r.slideCount && r.slideCount > r.options.slidesToShow && (s = e > r.slideCount ? (r.slideOffset = (r.options.slidesToShow - (e - r.slideCount)) * r.slideWidth * -1,
                                (r.options.slidesToShow - (e - r.slideCount)) * i * -1) : (r.slideOffset = r.slideCount % r.options.slidesToScroll * r.slideWidth * -1,
                                r.slideCount % r.options.slidesToScroll * i * -1))) : e + r.options.slidesToShow > r.slideCount && (r.slideOffset = (e + r.options.slidesToShow - r.slideCount) * r.slideWidth,
                            s = (e + r.options.slidesToShow - r.slideCount) * i),
                        r.slideCount <= r.options.slidesToShow && (s = r.slideOffset = 0), !0 === r.options.centerMode && r.slideCount <= r.options.slidesToShow ? r.slideOffset = r.slideWidth * Math.floor(r.options.slidesToShow) / 2 - r.slideWidth * r.slideCount / 2 : !0 === r.options.centerMode && !0 === r.options.infinite ? r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2) - r.slideWidth : !0 === r.options.centerMode && (r.slideOffset = 0,
                            r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2)),
                        t = !1 === r.options.vertical ? e * r.slideWidth * -1 + r.slideOffset : e * i * -1 + s, !0 === r.options.variableWidth && (n = r.slideCount <= r.options.slidesToShow || !1 === r.options.infinite ? r.$slideTrack.children(".slick-slide").eq(e) : r.$slideTrack.children(".slick-slide").eq(e + r.options.slidesToShow),
                            t = !0 === r.options.rtl ? n[0] ? -1 * (r.$slideTrack.width() - n[0].offsetLeft - n.width()) : 0 : n[0] ? -1 * n[0].offsetLeft : 0, !0 === r.options.centerMode && (n = r.slideCount <= r.options.slidesToShow || !1 === r.options.infinite ? r.$slideTrack.children(".slick-slide").eq(e) : r.$slideTrack.children(".slick-slide").eq(e + r.options.slidesToShow + 1),
                                t = !0 === r.options.rtl ? n[0] ? -1 * (r.$slideTrack.width() - n[0].offsetLeft - n.width()) : 0 : n[0] ? -1 * n[0].offsetLeft : 0,
                                t += (r.$list.width() - n.outerWidth()) / 2)),
                        t
                },
                r.prototype.getOption = r.prototype.slickGetOption = function(e) {
                    return this.options[e]
                },
                r.prototype.getNavigableIndexes = function() {
                    var e, t = this,
                        i = 0,
                        n = 0,
                        o = [];
                    for (e = !1 === t.options.infinite ? t.slideCount : (i = -1 * t.options.slidesToScroll,
                            n = -1 * t.options.slidesToScroll,
                            2 * t.slideCount); i < e;)
                        o.push(i),
                        i = n + t.options.slidesToScroll,
                        n += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
                    return o
                },
                r.prototype.getSlick = function() {
                    return this
                },
                r.prototype.getSlideCount = function() {
                    var i, n, o = this;
                    return n = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function(e, t) {
                            if (t.offsetLeft - n + c(t).outerWidth() / 2 > -1 * o.swipeLeft)
                                return i = t, !1
                        }),
                        Math.abs(c(i).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
                },
                r.prototype.goTo = r.prototype.slickGoTo = function(e, t) {
                    this.changeSlide({
                        data: {
                            message: "index",
                            index: parseInt(e)
                        }
                    }, t)
                },
                r.prototype.init = function(e) {
                    var t = this;
                    c(t.$slider).hasClass("slick-initialized") || (c(t.$slider).addClass("slick-initialized"),
                            t.buildRows(),
                            t.buildOut(),
                            t.setProps(),
                            t.startLoad(),
                            t.loadSlider(),
                            t.initializeEvents(),
                            t.updateArrows(),
                            t.updateDots(),
                            t.checkResponsive(!0),
                            t.focusHandler()),
                        e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(),
                        t.options.autoplay && (t.paused = !1,
                            t.autoPlay())
                },
                r.prototype.initADA = function() {
                    var i = this,
                        n = Math.ceil(i.slideCount / i.options.slidesToShow),
                        o = i.getNavigableIndexes().filter(function(e) {
                            return 0 <= e && e < i.slideCount
                        });
                    i.$slides.add(i.$slideTrack.find(".slick-cloned")).attr({
                            "aria-hidden": "true",
                            tabindex: "-1"
                        }).find("a, input, button, select").attr({
                            tabindex: "-1"
                        }),
                        null !== i.$dots && (i.$slides.not(i.$slideTrack.find(".slick-cloned")).each(function(e) {
                                var t = o.indexOf(e);
                                c(this).attr({
                                    role: "tabpanel",
                                    id: "slick-slide" + i.instanceUid + e,
                                    tabindex: -1
                                }), -1 !== t && c(this).attr({
                                    "aria-describedby": "slick-slide-control" + i.instanceUid + t
                                })
                            }),
                            i.$dots.attr("role", "tablist").find("li").each(function(e) {
                                var t = o[e];
                                c(this).attr({
                                        role: "presentation"
                                    }),
                                    c(this).find("button").first().attr({
                                        role: "tab",
                                        id: "slick-slide-control" + i.instanceUid + e,
                                        "aria-controls": "slick-slide" + i.instanceUid + t,
                                        "aria-label": e + 1 + " of " + n,
                                        "aria-selected": null,
                                        tabindex: "-1"
                                    })
                            }).eq(i.currentSlide).find("button").attr({
                                "aria-selected": "true",
                                tabindex: "0"
                            }).end());
                    for (var e = i.currentSlide, t = e + i.options.slidesToShow; e < t; e++)
                        i.$slides.eq(e).attr("tabindex", 0);
                    i.activateADA()
                },
                r.prototype.initArrowEvents = function() {
                    var e = this;
                    !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
                            message: "previous"
                        }, e.changeSlide),
                        e.$nextArrow.off("click.slick").on("click.slick", {
                            message: "next"
                        }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler),
                            e.$nextArrow.on("keydown.slick", e.keyHandler)))
                },
                r.prototype.initDotEvents = function() {
                    var e = this;
                    !0 === e.options.dots && (c("li", e.$dots).on("click.slick", {
                        message: "index"
                    }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && c("li", e.$dots).on("mouseenter.slick", c.proxy(e.interrupt, e, !0)).on("mouseleave.slick", c.proxy(e.interrupt, e, !1))
                },
                r.prototype.initSlideEvents = function() {
                    this.options.pauseOnHover && (this.$list.on("mouseenter.slick", c.proxy(this.interrupt, this, !0)),
                        this.$list.on("mouseleave.slick", c.proxy(this.interrupt, this, !1)))
                },
                r.prototype.initializeEvents = function() {
                    var e = this;
                    e.initArrowEvents(),
                        e.initDotEvents(),
                        e.initSlideEvents(),
                        e.$list.on("touchstart.slick mousedown.slick", {
                            action: "start"
                        }, e.swipeHandler),
                        e.$list.on("touchmove.slick mousemove.slick", {
                            action: "move"
                        }, e.swipeHandler),
                        e.$list.on("touchend.slick mouseup.slick", {
                            action: "end"
                        }, e.swipeHandler),
                        e.$list.on("touchcancel.slick mouseleave.slick", {
                            action: "end"
                        }, e.swipeHandler),
                        e.$list.on("click.slick", e.clickHandler),
                        c(document).on(e.visibilityChange, c.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler),
                        c(window).on("orientationchange.slick.slick-" + e.instanceUid, c.proxy(e.orientationChange, e)),
                        c(window).on("resize.slick.slick-" + e.instanceUid, c.proxy(e.resize, e)),
                        c("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
                        c(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
                        c(e.setPosition)
                },
                r.prototype.initUI = function() {
                    !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow.show(),
                        this.$nextArrow.show()), !0 === this.options.dots && this.slideCount > this.options.slidesToShow && this.$dots.show()
                },
                r.prototype.keyHandler = function(e) {
                    e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === this.options.accessibility ? this.changeSlide({
                        data: {
                            message: !0 === this.options.rtl ? "next" : "previous"
                        }
                    }) : 39 === e.keyCode && !0 === this.options.accessibility && this.changeSlide({
                        data: {
                            message: !0 === this.options.rtl ? "previous" : "next"
                        }
                    }))
                },
                r.prototype.lazyLoad = function() {
                    function e(e) {
                        c("img[data-lazy]", e).each(function() {
                            var e = c(this),
                                t = c(this).attr("data-lazy"),
                                i = c(this).attr("data-srcset"),
                                n = c(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
                                o = document.createElement("img");
                            o.onload = function() {
                                    e.animate({
                                        opacity: 0
                                    }, 100, function() {
                                        i && (e.attr("srcset", i),
                                                n && e.attr("sizes", n)),
                                            e.attr("src", t).animate({
                                                opacity: 1
                                            }, 200, function() {
                                                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                                            }),
                                            r.$slider.trigger("lazyLoaded", [r, e, t])
                                    })
                                },
                                o.onerror = function() {
                                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                                        r.$slider.trigger("lazyLoadError", [r, e, t])
                                },
                                o.src = t
                        })
                    }
                    var t, i, n, r = this;
                    if (!0 === r.options.centerMode ? n = !0 === r.options.infinite ? (i = r.currentSlide + (r.options.slidesToShow / 2 + 1)) + r.options.slidesToShow + 2 : (i = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)),
                            r.options.slidesToShow / 2 + 1 + 2 + r.currentSlide) : (i = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide,
                            n = Math.ceil(i + r.options.slidesToShow), !0 === r.options.fade && (0 < i && i--,
                                n <= r.slideCount && n++)),
                        t = r.$slider.find(".slick-slide").slice(i, n),
                        "anticipated" === r.options.lazyLoad)
                        for (var o = i - 1, s = n, a = r.$slider.find(".slick-slide"), l = 0; l < r.options.slidesToScroll; l++)
                            o < 0 && (o = r.slideCount - 1),
                            t = (t = t.add(a.eq(o))).add(a.eq(s)),
                            o--,
                            s++;
                    e(t),
                        r.slideCount <= r.options.slidesToShow ? e(r.$slider.find(".slick-slide")) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? e(r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow)) : 0 === r.currentSlide && e(r.$slider.find(".slick-cloned").slice(-1 * r.options.slidesToShow))
                },
                r.prototype.loadSlider = function() {
                    this.setPosition(),
                        this.$slideTrack.css({
                            opacity: 1
                        }),
                        this.$slider.removeClass("slick-loading"),
                        this.initUI(),
                        "progressive" === this.options.lazyLoad && this.progressiveLazyLoad()
                },
                r.prototype.next = r.prototype.slickNext = function() {
                    this.changeSlide({
                        data: {
                            message: "next"
                        }
                    })
                },
                r.prototype.orientationChange = function() {
                    this.checkResponsive(),
                        this.setPosition()
                },
                r.prototype.pause = r.prototype.slickPause = function() {
                    this.autoPlayClear(),
                        this.paused = !0
                },
                r.prototype.play = r.prototype.slickPlay = function() {
                    this.autoPlay(),
                        this.options.autoplay = !0,
                        this.paused = !1,
                        this.focussed = !1,
                        this.interrupted = !1
                },
                r.prototype.postSlide = function(e) {
                    var t = this;
                    t.unslicked || (t.$slider.trigger("afterChange", [t, e]),
                        t.animating = !1,
                        t.slideCount > t.options.slidesToShow && t.setPosition(),
                        t.swipeLeft = null,
                        t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(),
                            t.options.focusOnChange && c(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
                },
                r.prototype.prev = r.prototype.slickPrev = function() {
                    this.changeSlide({
                        data: {
                            message: "previous"
                        }
                    })
                },
                r.prototype.preventDefault = function(e) {
                    e.preventDefault()
                },
                r.prototype.progressiveLazyLoad = function(e) {
                    e = e || 1;
                    var t, i, n, o, r, s = this,
                        a = c("img[data-lazy]", s.$slider);
                    a.length ? (t = a.first(),
                        i = t.attr("data-lazy"),
                        n = t.attr("data-srcset"),
                        o = t.attr("data-sizes") || s.$slider.attr("data-sizes"),
                        (r = document.createElement("img")).onload = function() {
                            n && (t.attr("srcset", n),
                                    o && t.attr("sizes", o)),
                                t.attr("src", i).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === s.options.adaptiveHeight && s.setPosition(),
                                s.$slider.trigger("lazyLoaded", [s, t, i]),
                                s.progressiveLazyLoad()
                        },
                        r.onerror = function() {
                            e < 3 ? setTimeout(function() {
                                s.progressiveLazyLoad(e + 1)
                            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                                s.$slider.trigger("lazyLoadError", [s, t, i]),
                                s.progressiveLazyLoad())
                        },
                        r.src = i) : s.$slider.trigger("allImagesLoaded", [s])
                },
                r.prototype.refresh = function(e) {
                    var t, i, n = this;
                    i = n.slideCount - n.options.slidesToShow, !n.options.infinite && n.currentSlide > i && (n.currentSlide = i),
                        n.slideCount <= n.options.slidesToShow && (n.currentSlide = 0),
                        t = n.currentSlide,
                        n.destroy(!0),
                        c.extend(n, n.initials, {
                            currentSlide: t
                        }),
                        n.init(),
                        e || n.changeSlide({
                            data: {
                                message: "index",
                                index: t
                            }
                        }, !1)
                },
                r.prototype.registerBreakpoints = function() {
                    var e, t, i, n = this,
                        o = n.options.responsive || null;
                    if ("array" === c.type(o) && o.length) {
                        for (e in n.respondTo = n.options.respondTo || "window",
                            o)
                            if (i = n.breakpoints.length - 1,
                                o.hasOwnProperty(e)) {
                                for (t = o[e].breakpoint; 0 <= i;)
                                    n.breakpoints[i] && n.breakpoints[i] === t && n.breakpoints.splice(i, 1),
                                    i--;
                                n.breakpoints.push(t),
                                    n.breakpointSettings[t] = o[e].settings
                            }
                        n.breakpoints.sort(function(e, t) {
                            return n.options.mobileFirst ? e - t : t - e
                        })
                    }
                },
                r.prototype.reinit = function() {
                    var e = this;
                    e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"),
                        e.slideCount = e.$slides.length,
                        e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
                        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
                        e.registerBreakpoints(),
                        e.setProps(),
                        e.setupInfinite(),
                        e.buildArrows(),
                        e.updateArrows(),
                        e.initArrowEvents(),
                        e.buildDots(),
                        e.updateDots(),
                        e.initDotEvents(),
                        e.cleanUpSlideEvents(),
                        e.initSlideEvents(),
                        e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on("click.slick", e.selectHandler),
                        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
                        e.setPosition(),
                        e.focusHandler(),
                        e.paused = !e.options.autoplay,
                        e.autoPlay(),
                        e.$slider.trigger("reInit", [e])
                },
                r.prototype.resize = function() {
                    var e = this;
                    c(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay),
                        e.windowDelay = window.setTimeout(function() {
                            e.windowWidth = c(window).width(),
                                e.checkResponsive(),
                                e.unslicked || e.setPosition()
                        }, 50))
                },
                r.prototype.removeSlide = r.prototype.slickRemove = function(e, t, i) {
                    var n = this;
                    if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : n.slideCount - 1 : !0 === t ? --e : e,
                        n.slideCount < 1 || e < 0 || e > n.slideCount - 1)
                        return !1;
                    n.unload(), !0 === i ? n.$slideTrack.children().remove() : n.$slideTrack.children(this.options.slide).eq(e).remove(),
                        n.$slides = n.$slideTrack.children(this.options.slide),
                        n.$slideTrack.children(this.options.slide).detach(),
                        n.$slideTrack.append(n.$slides),
                        n.$slidesCache = n.$slides,
                        n.reinit()
                },
                r.prototype.setCSS = function(e) {
                    var t, i, n = this,
                        o = {};
                    !0 === n.options.rtl && (e = -e),
                        t = "left" == n.positionProp ? Math.ceil(e) + "px" : "0px",
                        i = "top" == n.positionProp ? Math.ceil(e) + "px" : "0px",
                        o[n.positionProp] = e, !1 === n.transformsEnabled || (!(o = {}) === n.cssTransitions ? o[n.animType] = "translate(" + t + ", " + i + ")" : o[n.animType] = "translate3d(" + t + ", " + i + ", 0px)"),
                        n.$slideTrack.css(o)
                },
                r.prototype.setDimensions = function() {
                    var e = this;
                    !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
                            padding: "0px " + e.options.centerPadding
                        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
                            padding: e.options.centerPadding + " 0px"
                        })),
                        e.listWidth = e.$list.width(),
                        e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow),
                            e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth),
                            e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
                    var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
                    !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
                },
                r.prototype.setFade = function() {
                    var i, n = this;
                    n.$slides.each(function(e, t) {
                            i = n.slideWidth * e * -1, !0 === n.options.rtl ? c(t).css({
                                position: "relative",
                                right: i,
                                top: 0,
                                zIndex: n.options.zIndex - 2,
                                opacity: 0
                            }) : c(t).css({
                                position: "relative",
                                left: i,
                                top: 0,
                                zIndex: n.options.zIndex - 2,
                                opacity: 0
                            })
                        }),
                        n.$slides.eq(n.currentSlide).css({
                            zIndex: n.options.zIndex - 1,
                            opacity: 1
                        })
                },
                r.prototype.setHeight = function() {
                    if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
                        var e = this.$slides.eq(this.currentSlide).outerHeight(!0);
                        this.$list.css("height", e)
                    }
                },
                r.prototype.setOption = r.prototype.slickSetOption = function() {
                    var e, t, i, n, o, r = this,
                        s = !1;
                    if ("object" === c.type(arguments[0]) ? (i = arguments[0],
                            s = arguments[1],
                            o = "multiple") : "string" === c.type(arguments[0]) && (i = arguments[0],
                            n = arguments[1],
                            s = arguments[2],
                            "responsive" === arguments[0] && "array" === c.type(arguments[1]) ? o = "responsive" : void 0 !== arguments[1] && (o = "single")),
                        "single" === o)
                        r.options[i] = n;
                    else if ("multiple" === o)
                        c.each(i, function(e, t) {
                            r.options[e] = t
                        });
                    else if ("responsive" === o)
                        for (t in n)
                            if ("array" !== c.type(r.options.responsive))
                                r.options.responsive = [n[t]];
                            else {
                                for (e = r.options.responsive.length - 1; 0 <= e;)
                                    r.options.responsive[e].breakpoint === n[t].breakpoint && r.options.responsive.splice(e, 1),
                                    e--;
                                r.options.responsive.push(n[t])
                            }
                    s && (r.unload(),
                        r.reinit())
                },
                r.prototype.setPosition = function() {
                    this.setDimensions(),
                        this.setHeight(), !1 === this.options.fade ? this.setCSS(this.getLeft(this.currentSlide)) : this.setFade(),
                        this.$slider.trigger("setPosition", [this])
                },
                r.prototype.setProps = function() {
                    var e = this,
                        t = document.body.style;
                    e.positionProp = !0 === e.options.vertical ? "top" : "left",
                        "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"),
                        void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0),
                        e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex),
                        void 0 !== t.OTransform && (e.animType = "OTransform",
                            e.transformType = "-o-transform",
                            e.transitionType = "OTransition",
                            void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.MozTransform && (e.animType = "MozTransform",
                            e.transformType = "-moz-transform",
                            e.transitionType = "MozTransition",
                            void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
                        void 0 !== t.webkitTransform && (e.animType = "webkitTransform",
                            e.transformType = "-webkit-transform",
                            e.transitionType = "webkitTransition",
                            void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                        void 0 !== t.msTransform && (e.animType = "msTransform",
                            e.transformType = "-ms-transform",
                            e.transitionType = "msTransition",
                            void 0 === t.msTransform && (e.animType = !1)),
                        void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform",
                            e.transformType = "transform",
                            e.transitionType = "transition"),
                        e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
                },
                r.prototype.setSlideClasses = function(e) {
                    var t, i, n, o, r = this;
                    if (i = r.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
                        r.$slides.eq(e).addClass("slick-current"), !0 === r.options.centerMode) {
                        var s = r.options.slidesToShow % 2 == 0 ? 1 : 0;
                        t = Math.floor(r.options.slidesToShow / 2), !0 === r.options.infinite && (t <= e && e <= r.slideCount - 1 - t ? r.$slides.slice(e - t + s, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (n = r.options.slidesToShow + e,
                                    i.slice(n - t + 1 + s, n + t + 2).addClass("slick-active").attr("aria-hidden", "false")),
                                0 === e ? i.eq(i.length - 1 - r.options.slidesToShow).addClass("slick-center") : e === r.slideCount - 1 && i.eq(r.options.slidesToShow).addClass("slick-center")),
                            r.$slides.eq(e).addClass("slick-center")
                    } else
                        0 <= e && e <= r.slideCount - r.options.slidesToShow ? r.$slides.slice(e, e + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= r.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (o = r.slideCount % r.options.slidesToShow,
                            n = !0 === r.options.infinite ? r.options.slidesToShow + e : e,
                            r.options.slidesToShow == r.options.slidesToScroll && r.slideCount - e < r.options.slidesToShow ? i.slice(n - (r.options.slidesToShow - o), n + o).addClass("slick-active").attr("aria-hidden", "false") : i.slice(n, n + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
                    "ondemand" !== r.options.lazyLoad && "anticipated" !== r.options.lazyLoad || r.lazyLoad()
                },
                r.prototype.setupInfinite = function() {
                    var e, t, i, n = this;
                    if (!0 === n.options.fade && (n.options.centerMode = !1), !0 === n.options.infinite && !1 === n.options.fade && (t = null,
                            n.slideCount > n.options.slidesToShow)) {
                        for (i = !0 === n.options.centerMode ? n.options.slidesToShow + 1 : n.options.slidesToShow,
                            e = n.slideCount; e > n.slideCount - i; e -= 1)
                            t = e - 1,
                            c(n.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - n.slideCount).prependTo(n.$slideTrack).addClass("slick-cloned");
                        for (e = 0; e < i + n.slideCount; e += 1)
                            t = e,
                            c(n.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + n.slideCount).appendTo(n.$slideTrack).addClass("slick-cloned");
                        n.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                            c(this).attr("id", "")
                        })
                    }
                },
                r.prototype.interrupt = function(e) {
                    e || this.autoPlay(),
                        this.interrupted = e
                },
                r.prototype.selectHandler = function(e) {
                    var t = c(e.target).is(".slick-slide") ? c(e.target) : c(e.target).parents(".slick-slide"),
                        i = parseInt(t.attr("data-slick-index"));
                    i || (i = 0),
                        this.slideCount <= this.options.slidesToShow ? this.slideHandler(i, !1, !0) : this.slideHandler(i)
                },
                r.prototype.slideHandler = function(e, t, i) {
                    var n, o, r, s, a, l = null,
                        c = this;
                    if (t = t || !1, !(!0 === c.animating && !0 === c.options.waitForAnimate || !0 === c.options.fade && c.currentSlide === e))
                        if (!1 === t && c.asNavFor(e),
                            n = e,
                            l = c.getLeft(n),
                            s = c.getLeft(c.currentSlide),
                            c.currentLeft = null === c.swipeLeft ? s : c.swipeLeft, !1 === c.options.infinite && !1 === c.options.centerMode && (e < 0 || e > c.getDotCount() * c.options.slidesToScroll))
                            !1 === c.options.fade && (n = c.currentSlide, !0 !== i ? c.animateSlide(s, function() {
                                c.postSlide(n)
                            }) : c.postSlide(n));
                        else if (!1 === c.options.infinite && !0 === c.options.centerMode && (e < 0 || e > c.slideCount - c.options.slidesToScroll))
                        !1 === c.options.fade && (n = c.currentSlide, !0 !== i ? c.animateSlide(s, function() {
                            c.postSlide(n)
                        }) : c.postSlide(n));
                    else {
                        if (c.options.autoplay && clearInterval(c.autoPlayTimer),
                            o = n < 0 ? c.slideCount % c.options.slidesToScroll != 0 ? c.slideCount - c.slideCount % c.options.slidesToScroll : c.slideCount + n : n >= c.slideCount ? c.slideCount % c.options.slidesToScroll != 0 ? 0 : n - c.slideCount : n,
                            c.animating = !0,
                            c.$slider.trigger("beforeChange", [c, c.currentSlide, o]),
                            r = c.currentSlide,
                            c.currentSlide = o,
                            c.setSlideClasses(c.currentSlide),
                            c.options.asNavFor && (a = (a = c.getNavTarget()).slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(c.currentSlide),
                            c.updateDots(),
                            c.updateArrows(), !0 === c.options.fade)
                            return !0 !== i ? (c.fadeSlideOut(r),
                                    c.fadeSlide(o, function() {
                                        c.postSlide(o)
                                    })) : c.postSlide(o),
                                void c.animateHeight();
                        !0 !== i ? c.animateSlide(l, function() {
                            c.postSlide(o)
                        }) : c.postSlide(o)
                    }
                },
                r.prototype.startLoad = function() {
                    var e = this;
                    !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(),
                            e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
                        e.$slider.addClass("slick-loading")
                },
                r.prototype.swipeDirection = function() {
                    var e, t, i, n;
                    return e = this.touchObject.startX - this.touchObject.curX,
                        t = this.touchObject.startY - this.touchObject.curY,
                        i = Math.atan2(t, e),
                        (n = Math.round(180 * i / Math.PI)) < 0 && (n = 360 - Math.abs(n)),
                        n <= 45 && 0 <= n ? !1 === this.options.rtl ? "left" : "right" : n <= 360 && 315 <= n ? !1 === this.options.rtl ? "left" : "right" : 135 <= n && n <= 225 ? !1 === this.options.rtl ? "right" : "left" : !0 === this.options.verticalSwiping ? 35 <= n && n <= 135 ? "down" : "up" : "vertical"
                },
                r.prototype.swipeEnd = function(e) {
                    var t, i, n = this;
                    if (n.dragging = !1,
                        n.swiping = !1,
                        n.scrolling)
                        return n.scrolling = !1;
                    if (n.interrupted = !1,
                        n.shouldClick = !(10 < n.touchObject.swipeLength),
                        void 0 === n.touchObject.curX)
                        return !1;
                    if (!0 === n.touchObject.edgeHit && n.$slider.trigger("edge", [n, n.swipeDirection()]),
                        n.touchObject.swipeLength >= n.touchObject.minSwipe) {
                        switch (i = n.swipeDirection()) {
                            case "left":
                            case "down":
                                t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide + n.getSlideCount()) : n.currentSlide + n.getSlideCount(),
                                    n.currentDirection = 0;
                                break;
                            case "right":
                            case "up":
                                t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide - n.getSlideCount()) : n.currentSlide - n.getSlideCount(),
                                    n.currentDirection = 1
                        }
                        "vertical" != i && (n.slideHandler(t),
                            n.touchObject = {},
                            n.$slider.trigger("swipe", [n, i]))
                    } else
                        n.touchObject.startX !== n.touchObject.curX && (n.slideHandler(n.currentSlide),
                            n.touchObject = {})
                },
                r.prototype.swipeHandler = function(e) {
                    var t = this;
                    if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse")))
                        switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1,
                            t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
                            e.data.action) {
                            case "start":
                                t.swipeStart(e);
                                break;
                            case "move":
                                t.swipeMove(e);
                                break;
                            case "end":
                                t.swipeEnd(e)
                        }
                },
                r.prototype.swipeMove = function(e) {
                    var t, i, n, o, r, s, a = this;
                    return r = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !(!a.dragging || a.scrolling || r && 1 !== r.length) && (t = a.getLeft(a.currentSlide),
                        a.touchObject.curX = void 0 !== r ? r[0].pageX : e.clientX,
                        a.touchObject.curY = void 0 !== r ? r[0].pageY : e.clientY,
                        a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))),
                        s = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))), !a.options.verticalSwiping && !a.swiping && 4 < s ? !(a.scrolling = !0) : (!0 === a.options.verticalSwiping && (a.touchObject.swipeLength = s),
                            i = a.swipeDirection(),
                            void 0 !== e.originalEvent && 4 < a.touchObject.swipeLength && (a.swiping = !0,
                                e.preventDefault()),
                            o = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), !0 === a.options.verticalSwiping && (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1),
                            n = a.touchObject.swipeLength,
                            (a.touchObject.edgeHit = !1) === a.options.infinite && (0 === a.currentSlide && "right" === i || a.currentSlide >= a.getDotCount() && "left" === i) && (n = a.touchObject.swipeLength * a.options.edgeFriction,
                                a.touchObject.edgeHit = !0), !1 === a.options.vertical ? a.swipeLeft = t + n * o : a.swipeLeft = t + n * (a.$list.height() / a.listWidth) * o, !0 === a.options.verticalSwiping && (a.swipeLeft = t + n * o), !0 !== a.options.fade && !1 !== a.options.touchMove && (!0 === a.animating ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))))
                },
                r.prototype.swipeStart = function(e) {
                    var t, i = this;
                    if (i.interrupted = !0,
                        1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow)
                        return !(i.touchObject = {});
                    void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
                        i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX,
                        i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY,
                        i.dragging = !0
                },
                r.prototype.unfilterSlides = r.prototype.slickUnfilter = function() {
                    null !== this.$slidesCache && (this.unload(),
                        this.$slideTrack.children(this.options.slide).detach(),
                        this.$slidesCache.appendTo(this.$slideTrack),
                        this.reinit())
                },
                r.prototype.unload = function() {
                    var e = this;
                    c(".slick-cloned", e.$slider).remove(),
                        e.$dots && e.$dots.remove(),
                        e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
                        e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
                        e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
                },
                r.prototype.unslick = function(e) {
                    this.$slider.trigger("unslick", [this, e]),
                        this.destroy()
                },
                r.prototype.updateArrows = function() {
                    var e = this;
                    Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                            e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                            e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
                            e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
                },
                r.prototype.updateDots = function() {
                    null !== this.$dots && (this.$dots.find("li").removeClass("slick-active").end(),
                        this.$dots.find("li").eq(Math.floor(this.currentSlide / this.options.slidesToScroll)).addClass("slick-active"))
                },
                r.prototype.visibility = function() {
                    this.options.autoplay && (document[this.hidden] ? this.interrupted = !0 : this.interrupted = !1)
                },
                c.fn.slick = function() {
                    var e, t, i = arguments[0],
                        n = Array.prototype.slice.call(arguments, 1),
                        o = this.length;
                    for (e = 0; e < o; e++)
                        if ("object" == typeof i || void 0 === i ? this[e].slick = new r(this[e], i) : t = this[e].slick[i].apply(this[e].slick, n),
                            void 0 !== t)
                            return t;
                    return this
                }
        }),
    $(function() {
        "use strict";
        jQuery("img.svg").each(function() {
            var i = jQuery(this),
                n = i.attr("id"),
                o = i.attr("class"),
                e = i.attr("src");
            jQuery.get(e, function(e) {
                var t = jQuery(e).find("svg");
                void 0 !== n && (t = t.attr("id", n)),
                    void 0 !== o && (t = t.attr("class", o + " replaced-svg")), !(t = t.removeAttr("xmlns:a")).attr("viewBox") && t.attr("height") && t.attr("width") && t.attr("viewBox", "0 0 " + t.attr("height") + " " + t.attr("width")),
                    i.replaceWith(t)
            }, "xml")
        })
    }),
    function(t) {
        "use strict";
        t(".toggler__btn").on("click", function() {
                t(".switcher").toggleClass("switcher__is-open")
            }),
            t("body").on("click", function(e) {
                t(".switcher").removeClass("switcher__is-open")
            }),
            t("body").on("click", ".toggler__btn", function(e) {
                e.stopPropagation()
            }),
            t("body").on("click", ".switcher-wrapper", function(e) {
                e.stopPropagation()
            }),
            t(".tab-color").on("click", function() {
                t(".switcher-gradient").removeClass("active"),
                    t(".switcher-color").addClass("active"),
                    t(".tab-gradient").removeClass("active"),
                    t(this).addClass("active")
            }),
            t(".tab-gradient").on("click", function() {
                t(".switcher-color").removeClass("active"),
                    t(".switcher-gradient").addClass("active"),
                    t(".tab-color").removeClass("active"),
                    t(this).addClass("active")
            }),
            t(".switcher-tab__color button").on("click", function() {
                var e = t(".tab-color-clone").find(".active");
                0 < e.length && t("body").removeClass(e.attr("data-theme")),
                    t("body").addClass(t(this).attr("data-theme")),
                    t(".switcher-tab__color button").removeClass("active"),
                    t(this).addClass("active")
            }),
            t(".tab-full").on("click", function() {
                t(".switcher-boxed").removeClass("active"),
                    t("body").removeClass("boxed-layout"),
                    t(".tab-boxed").removeClass("active"),
                    t(this).addClass("active")
            }),
            t(".tab-boxed").on("click", function() {
                t(".switcher-boxed").addClass("active"),
                    t("body").addClass("boxed-layout"),
                    t(".tab-full").removeClass("active"),
                    t(this).addClass("active")
            }),
            t(".switcher-tab__pattern button").on("click", function() {
                var e = t(".switcher-boxed").find(".active");
                0 < e.length && t("body").removeClass(e.attr("data-theme")),
                    t("body").addClass(t(this).attr("data-theme")),
                    t(".switcher-tab__pattern button").removeClass("active"),
                    t(this).addClass("active")
            })
    }(jQuery),
    function(x) {
        "use strict";
        var _, k, T, S, E, C, A, O, D, N, L, I, j, $, M, P, H, q, W, R, F, z, B, U, V, Y, X, Q, K, G, Z, J, ee, te, ie, ne, oe, re, se, ae, le;
        x.fn.extend({
            venobox: function(e) {
                var b = this,
                    w = x.extend({
                        arrowsColor: "#B6B6B6",
                        autoplay: !1,
                        bgcolor: "#fff",
                        border: "0",
                        closeBackground: "#161617",
                        closeColor: "#d2d2d2",
                        framewidth: "",
                        frameheight: "",
                        gallItems: !1,
                        infinigall: !1,
                        htmlClose: "&times;",
                        htmlNext: "<span>Next</span>",
                        htmlPrev: "<span>Prev</span>",
                        numeratio: !1,
                        numerationBackground: "#161617",
                        numerationColor: "#d2d2d2",
                        numerationPosition: "top",
                        overlayClose: !0,
                        overlayColor: "rgba(23,23,23,0.85)",
                        spinner: "double-bounce",
                        spinColor: "#d2d2d2",
                        titleattr: "title",
                        titleBackground: "#161617",
                        titleColor: "#d2d2d2",
                        titlePosition: "top",
                        cb_pre_open: function() {
                            return !0
                        },
                        cb_post_open: function() {},
                        cb_pre_close: function() {
                            return !0
                        },
                        cb_post_close: function() {},
                        cb_post_resize: function() {},
                        cb_after_nav: function() {},
                        cb_content_loaded: function() {},
                        cb_init: function() {}
                    }, e);
                return w.cb_init(b),
                    this.each(function() {
                        if ((K = x(this)).data("venobox"))
                            return !0;

                        function t() {
                            F = K.data("gall"),
                                H = K.data("numeratio"),
                                I = K.data("gallItems"),
                                j = K.data("infinigall"),
                                $ = I || x('.vbox-item[data-gall="' + F + '"]'),
                                z = $.eq($.index(K) + 1),
                                B = $.eq($.index(K) - 1),
                                z.length || !0 !== j || (z = $.eq(0)),
                                1 < $.length ? (G = $.index(K) + 1,
                                    T.html(G + " / " + $.length)) : G = 1, !0 === H ? T.show() : T.hide(),
                                "" !== R ? S.show() : S.hide(),
                                U = z.length || !0 === j ? (x(".vbox-next").css("display", "block"), !0) : (x(".vbox-next").css("display", "none"), !1), !0 !== (V = 0 < $.index(K) || !0 === j ? (x(".vbox-prev").css("display", "block"), !0) : (x(".vbox-prev").css("display", "none"), !1)) && !0 !== U || (A.on(l.DOWN, r),
                                    A.on(l.MOVE, s),
                                    A.on(l.UP, a))
                        }

                        function n(e) {
                            return !(e.length < 1) && !M && (M = !0,
                                q = e.data("overlay") || e.data("overlaycolor"),
                                N = e.data("framewidth"),
                                L = e.data("frameheight"),
                                E = e.data("border"),
                                k = e.data("bgcolor"),
                                O = e.data("href") || e.attr("href"),
                                _ = e.data("autoplay"),
                                R = e.attr(e.data("titleattr")) || "",
                                e === B && A.addClass("animated").addClass("swipe-right"),
                                e === z && A.addClass("animated").addClass("swipe-left"),
                                X.show(),
                                void A.animate({
                                    opacity: 0
                                }, 500, function() {
                                    W.css("background", q),
                                        A.removeClass("animated").removeClass("swipe-left").removeClass("swipe-right").css({
                                            "margin-left": 0,
                                            "margin-right": 0
                                        }),
                                        "iframe" == e.data("vbtype") ? p() : "inline" == e.data("vbtype") ? g() : "ajax" == e.data("vbtype") ? f() : "video" == e.data("vbtype") ? h(_) : (A.html('<img src="' + O + '">'),
                                            v()),
                                        K = e,
                                        t(),
                                        M = !1,
                                        w.cb_after_nav(K, G, z, B)
                                }))
                        }

                        function i(e) {
                            27 === e.keyCode && o(),
                                37 == e.keyCode && !0 === V && n(B),
                                39 == e.keyCode && !0 === U && n(z)
                        }

                        function o() {
                            if (!1 === w.cb_pre_close(K, G, z, B))
                                return !1;
                            x("body").off("keydown", i).removeClass("vbox-open"),
                                K.focus(),
                                W.animate({
                                    opacity: 0
                                }, 500, function() {
                                    W.remove(),
                                        M = !1,
                                        w.cb_post_close()
                                })
                        }
                        b.VBclose = function() {
                                o()
                            },
                            K.addClass("vbox-item"),
                            K.data("framewidth", w.framewidth),
                            K.data("frameheight", w.frameheight),
                            K.data("border", w.border),
                            K.data("bgcolor", w.bgcolor),
                            K.data("numeratio", w.numeratio),
                            K.data("gallItems", w.gallItems),
                            K.data("infinigall", w.infinigall),
                            K.data("overlaycolor", w.overlayColor),
                            K.data("titleattr", w.titleattr),
                            K.data("venobox", !0),
                            K.on("click", function(e) {
                                if (e.preventDefault(),
                                    K = x(this), !1 === w.cb_pre_open(K))
                                    return !1;
                                switch (b.VBnext = function() {
                                        n(z)
                                    },
                                    b.VBprev = function() {
                                        n(B)
                                    },
                                    q = K.data("overlay") || K.data("overlaycolor"),
                                    N = K.data("framewidth"),
                                    L = K.data("frameheight"),
                                    _ = K.data("autoplay") || w.autoplay,
                                    E = K.data("border"),
                                    k = K.data("bgcolor"),
                                    M = V = U = !1,
                                    O = K.data("href") || K.attr("href"),
                                    D = K.data("css") || "",
                                    R = K.attr(K.data("titleattr")) || "",
                                    Y = '<div class="vbox-preloader">',
                                    w.spinner) {
                                    case "rotating-plane":
                                        Y += '<div class="sk-rotating-plane"></div>';
                                        break;
                                    case "double-bounce":
                                        Y += '<div class="sk-double-bounce"><div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div></div>';
                                        break;
                                    case "wave":
                                        Y += '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>';
                                        break;
                                    case "wandering-cubes":
                                        Y += '<div class="sk-wandering-cubes"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div></div>';
                                        break;
                                    case "spinner-pulse":
                                        Y += '<div class="sk-spinner sk-spinner-pulse"></div>';
                                        break;
                                    case "chasing-dots":
                                        Y += '<div class="sk-chasing-dots"><div class="sk-child sk-dot1"></div><div class="sk-child sk-dot2"></div></div>';
                                        break;
                                    case "three-bounce":
                                        Y += '<div class="sk-three-bounce"><div class="sk-child sk-bounce1"></div><div class="sk-child sk-bounce2"></div><div class="sk-child sk-bounce3"></div></div>';
                                        break;
                                    case "circle":
                                        Y += '<div class="sk-circle"><div class="sk-circle1 sk-child"></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div><div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div><div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div></div>';
                                        break;
                                    case "cube-grid":
                                        Y += '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
                                        break;
                                    case "fading-circle":
                                        Y += '<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>';
                                        break;
                                    case "folding-cube":
                                        Y += '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'
                                }
                                return Y += "</div>",
                                    Q = '<a class="vbox-next">' + w.htmlNext + '</a><a class="vbox-prev">' + w.htmlPrev + "</a>",
                                    J = '<div class="vbox-title"></div><div class="vbox-num">0/0</div><div class="vbox-close">' + w.htmlClose + "</div>",
                                    C = '<div class="vbox-overlay ' + D + '" style="background:' + q + '">' + Y + '<div class="vbox-container"><div class="vbox-content"></div></div>' + J + Q + "</div>",
                                    x("body").append(C).addClass("vbox-open"),
                                    x(".vbox-preloader div:not(.sk-circle) .sk-child, .vbox-preloader .sk-rotating-plane, .vbox-preloader .sk-rect, .vbox-preloader div:not(.sk-folding-cube) .sk-cube, .vbox-preloader .sk-spinner-pulse").css("background-color", w.spinColor),
                                    W = x(".vbox-overlay"),
                                    x(".vbox-container"),
                                    A = x(".vbox-content"),
                                    T = x(".vbox-num"),
                                    S = x(".vbox-title"),
                                    (X = x(".vbox-preloader")).show(),
                                    S.css(w.titlePosition, "-1px"),
                                    S.css({
                                        color: w.titleColor,
                                        "background-color": w.titleBackground
                                    }),
                                    x(".vbox-close").css({
                                        color: w.closeColor,
                                        "background-color": w.closeBackground
                                    }),
                                    x(".vbox-num").css(w.numerationPosition, "-1px"),
                                    x(".vbox-num").css({
                                        color: w.numerationColor,
                                        "background-color": w.numerationBackground
                                    }),
                                    x(".vbox-next span, .vbox-prev span").css({
                                        "border-top-color": w.arrowsColor,
                                        "border-right-color": w.arrowsColor
                                    }),
                                    A.html(""),
                                    A.css("opacity", "0"),
                                    W.css("opacity", "0"),
                                    t(),
                                    W.animate({
                                        opacity: 1
                                    }, 250, function() {
                                        "iframe" == K.data("vbtype") ? p() : "inline" == K.data("vbtype") ? g() : "ajax" == K.data("vbtype") ? f() : "video" == K.data("vbtype") ? h(_) : (A.html('<img src="' + O + '">'),
                                                v()),
                                            w.cb_post_open(K, G, z, B)
                                    }),
                                    x("body").keydown(i),
                                    x(".vbox-prev").on("click", function() {
                                        n(B)
                                    }),
                                    x(".vbox-next").on("click", function() {
                                        n(z)
                                    }), !1
                            });
                        var e = ".vbox-overlay";

                        function r(e) {
                            A.addClass("animated"),
                                te = ne = e.pageY,
                                ie = oe = e.pageX,
                                Z = !0
                        }

                        function s(e) {
                            if (!0 === Z) {
                                oe = e.pageX,
                                    ne = e.pageY,
                                    se = oe - ie,
                                    ae = ne - te;
                                var t = Math.abs(se);
                                t > Math.abs(ae) && t <= 100 && (e.preventDefault(),
                                    A.css("margin-left", se))
                            }
                        }

                        function a(e) {
                            if (!0 === Z) {
                                var t = K,
                                    i = Z = !1;
                                (re = oe - ie) < 0 && !0 === U && (t = z,
                                        i = !0),
                                    0 < re && !0 === V && (t = B,
                                        i = !0),
                                    Math.abs(re) >= le && !0 === i ? n(t) : A.css({
                                        "margin-left": 0,
                                        "margin-right": 0
                                    })
                            }
                        }
                        w.overlayClose || (e = ".vbox-close"),
                            x("body").on("click touchstart", e, function(e) {
                                (x(e.target).is(".vbox-overlay") || x(e.target).is(".vbox-content") || x(e.target).is(".vbox-close") || x(e.target).is(".vbox-preloader") || x(e.target).is(".vbox-container")) && o()
                            }),
                            re = oe = ie = 0,
                            Z = !(le = 50);
                        var l = {
                                DOWN: "touchmousedown",
                                UP: "touchmouseup",
                                MOVE: "touchmousemove"
                            },
                            c = function(e) {
                                var t;
                                switch (e.type) {
                                    case "mousedown":
                                        t = l.DOWN;
                                        break;
                                    case "mouseup":
                                    case "mouseout":
                                        t = l.UP;
                                        break;
                                    case "mousemove":
                                        t = l.MOVE;
                                        break;
                                    default:
                                        return
                                }
                                var i = u(t, e, e.pageX, e.pageY);
                                x(e.target).trigger(i)
                            },
                            d = function(e) {
                                var t;
                                switch (e.type) {
                                    case "touchstart":
                                        t = l.DOWN;
                                        break;
                                    case "touchend":
                                        t = l.UP;
                                        break;
                                    case "touchmove":
                                        t = l.MOVE;
                                        break;
                                    default:
                                        return
                                }
                                var i, n = e.originalEvent.touches[0];
                                i = t == l.UP ? u(t, e, null, null) : u(t, e, n.pageX, n.pageY),
                                    x(e.target).trigger(i)
                            },
                            u = function(e, t, i, n) {
                                return x.Event(e, {
                                    pageX: i,
                                    pageY: n,
                                    originalEvent: t
                                })
                            };

                        function f() {
                            x.ajax({
                                url: O,
                                cache: !1
                            }).done(function(e) {
                                A.html('<div class="vbox-inline">' + e + "</div>"),
                                    v()
                            }).fail(function() {
                                A.html('<div class="vbox-inline"><p>Error retrieving contents, please retry</div>'),
                                    m()
                            })
                        }

                        function p() {
                            A.html('<iframe class="venoframe" src="' + O + '"></iframe>'),
                                m()
                        }

                        function h(e) {
                            var t, i, n = (O.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), -1 < RegExp.$3.indexOf("youtu") ? i = "youtube" : -1 < RegExp.$3.indexOf("vimeo") && (i = "vimeo"), {
                                    type: i,
                                    id: RegExp.$6
                                }),
                                o = (e ? "?rel=0&autoplay=1" : "?rel=0") + function(e) {
                                    var t = "",
                                        i = decodeURIComponent(O).split("?");
                                    if (void 0 !== i[1]) {
                                        var n, o, r = i[1].split("&");
                                        for (o = 0; o < r.length; o++)
                                            t = t + "&" + (n = r[o].split("="))[0] + "=" + n[1]
                                    }
                                    return encodeURI(t)
                                }();
                            "vimeo" == n.type ? t = "https://player.vimeo.com/video/" : "youtube" == n.type && (t = "https://www.youtube.com/embed/"),
                                A.html('<iframe class="venoframe vbvid" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay" frameborder="0" src="' + t + n.id + o + '"></iframe>'),
                                m()
                        }

                        function g() {
                            A.html('<div class="vbox-inline">' + x(O).html() + "</div>"),
                                m()
                        }

                        function v() {
                            (ee = A.find("img")).length ? ee.each(function() {
                                x(this).one("load", function() {
                                    m()
                                })
                            }) : m()
                        }

                        function m() {
                            S.html(R),
                                A.find(">:first-child").addClass("figlio").css({
                                    width: N,
                                    height: L,
                                    padding: E,
                                    background: k
                                }),
                                x("img.figlio").on("dragstart", function(e) {
                                    e.preventDefault()
                                }),
                                y(),
                                A.animate({
                                    opacity: "1"
                                }, "slow", function() {
                                    X.hide()
                                }),
                                w.cb_content_loaded(K, G, z, B)
                        }

                        function y() {
                            var e = A.outerHeight(),
                                t = x(window).height();
                            P = e + 60 < t ? (t - e) / 2 : "30px",
                                A.css("margin-top", P),
                                A.css("margin-bottom", P),
                                w.cb_post_resize()
                        }
                        "ontouchstart" in window ? (x(document).on("touchstart", d),
                                x(document).on("touchmove", d),
                                x(document).on("touchend", d)) : (x(document).on("mousedown", c),
                                x(document).on("mouseup", c),
                                x(document).on("mouseout", c),
                                x(document).on("mousemove", c)),
                            x(window).resize(function() {
                                x(".vbox-content").length && setTimeout(y(), 800)
                            })
                    })
            }
        })
    }(jQuery);