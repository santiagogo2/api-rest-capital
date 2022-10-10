"use strict";
var ActiveDirectory = require('activedirectory');
var config = {
    url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
    baseDN: 'dc=capitalsalud,dc=loc',
};
let ad = new ActiveDirectory(config);
let username = 'Santiagorg@capitalsalud.loc';
let password = 'Capital2022*';
//# sourceMappingURL=ldap-connection.js.map