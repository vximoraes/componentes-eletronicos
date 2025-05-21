class NotificacaoFilterBuilder {
    
    constructor() {
      this.filtros = {};
    }
  
    porUsuario(usuarioId) {
      if (usuarioId) {
        this.filtros.usuario = usuarioId;
      }
      return this;
    }
  
    porDataInicial(dataInicial) {
      if (dataInicial) {
        if (!this.filtros.data_hora) this.filtros.data_hora = {};
        this.filtros.data_hora.$gte = new Date(dataInicial);
      }
      return this;
    }
  
    porDataFinal(dataFinal) {
      if (dataFinal) {
        if (!this.filtros.data_hora) this.filtros.data_hora = {};
        this.filtros.data_hora.$lte = new Date(dataFinal);
      }
      return this;
    }
  
    porVisualizacao(visualizada) {
      if (visualizada === "true") {
        this.filtros.visualizacao = { $ne: null };
      } else if (visualizada === "false") {
        this.filtros.visualizacao = null;
      }
      return this;
    }
  
    build() {
      return this.filtros;
    }
  }
  
export default NotificacaoFilterBuilder;
  