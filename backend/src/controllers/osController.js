const osModel = require("../models/osModel");
const PDFDocument = require("pdfkit");

const criarOS = async (req, res) => {
  try {
    const resultado = await osModel.criar(req.body);

    res.status(201).json({
      mensagem: "Ordem de serviço cadastrada com sucesso",
      id: resultado.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar ordem de serviço" });
  }
};

const listarOS = async (req, res) => {
  try {
    const ordens = await osModel.listar();
    res.json(ordens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar ordens de serviço" });
  }
};

const buscarOSPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ordem = await osModel.buscarPorId(id);

    if (!ordem) {
      return res.status(404).json({ erro: "Ordem de serviço não encontrada" });
    }

    res.json(ordem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar ordem de serviço" });
  }
};

// permitir editar apenas OSs pendentes
const atualizarOS = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await osModel.atualizar(id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(400).json({
        erro: "A OS não foi encontrada ou não está pendente para edição"
      });
    }

    res.json({ mensagem: "Ordem de serviço atualizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar ordem de serviço" });
  }
};

const atualizarStatusOS = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ordemAtual = await osModel.buscarStatusPorId(id);

    if (!ordemAtual) {
      return res.status(404).json({ erro: "Ordem de serviço não encontrada" });
    }

    const statusAtual = ordemAtual.status;

    // Regra 1: pendente só pode virar aprovada ou recusada
    if (statusAtual === "pendente") {
      if (status !== "aprovada" && status !== "recusada") {
        return res.status(400).json({
          erro: "Uma OS pendente só pode ser aprovada ou recusada"
        });
      }
    }

    // Regra 2: aprovada só pode virar finalizada
    else if (statusAtual === "aprovada") {
      if (status !== "finalizada") {
        return res.status(400).json({
          erro: "Uma OS aprovada só pode ser finalizada"
        });
      }
    }

    // Regra 3: recusada não pode mudar mais
    else if (statusAtual === "recusada") {
      return res.status(400).json({
        erro: "Uma OS recusada não pode ter o status alterado"
      });
    }

    // Regra 4: finalizada não pode mudar mais
    else if (statusAtual === "finalizada") {
      return res.status(400).json({
        erro: "Uma OS finalizada não pode ter o status alterado"
      });
    }

    const resultado = await osModel.atualizarStatus(id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Ordem de serviço não encontrada" });
    }

    res.json({ mensagem: "Status atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar status" });
  }
};

const gerarPDFOrdem = async (req, res) => {
  try {
    const ordem = await osModel.buscarOrdem(id);

    if (!ordem) {
      return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    const descricao = String(ordem.descricao_projeto || '').slice(0, 500);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=ordem_${id}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text(`Ordem de Serviço #${ordem.id}`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(12);

    doc.text(`Tipo: ${ordem.tipo_solicitante}`);
    doc.text(`Nome do Projeto: ${ordem.nome_projeto}`);
    doc.text(`Setor Interno: ${ordem.setor_interno || '-'}`);
    doc.text(`Solicitante Externo: ${ordem.solicitante_externo || '-'}`);
    doc.text(`Contato: ${ordem.contato || '-'}`);

    doc.moveDown();
    doc.text(`Descrição: ${descricao}`);

    doc.moveDown();
    doc.text(`Medida: ${ordem.medida_final || '-'}`);
    doc.text(`Quantidade: ${ordem.quantidade || '-'}`);
    doc.text(`Manipulação: ${ordem.manipulacao_arquivo ? 'Sim' : 'Não'}`);

    doc.moveDown();
    doc.text(`Processos: ${ordem.processos || '-'}`);
    doc.text(`Materiais: ${ordem.materiais || '-'}`);
    doc.text(`Observações: ${ordem.observacoes || '-'}`);

    doc.moveDown();
    doc.text(`Status: ${ordem.status || '-'}`);
    doc.text(`Coordenador: ${ordem.coordenador_nome || '-'}`);

    doc.moveDown();
    doc.text(`Data de Lançamento: ${ordem.data_lancamento || '-'}`);
    doc.text(`Data de Autorização: ${ordem.data_autorizacao || '-'}`);
    doc.text(`Data de Conclusão: ${ordem.data_conclusao || '-'}`);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar pdf' });
  }
}

module.exports = {
  criarOS,
  listarOS,
  buscarOSPorId,
  atualizarOS,
  atualizarStatusOS,
  gerarPDFOrdem
};