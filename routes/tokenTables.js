const tabelasPorToken = {
  '112233': {
    tabelas: ['senai', 'dell'],
    dashboard: 'dashboard.html' // usuário normal
  },
  '445566': {
    tabelas: ['Henkel'],
    dashboard: 'dashboard.html' // usuário normal
  },
  '123456': {
    tabelas: ['*'],             // acesso total a todas as tabelas
    dashboard: 'admin.html' // admin
  }
};

module.exports = tabelasPorToken;
