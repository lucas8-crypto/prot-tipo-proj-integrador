const express = require("express");
const router = express.Router();
const osController = require("../controllers/osController");

router.post("/", osController.criarOS);
router.get("/", osController.listarOS);
router.get("/:id", osController.buscarOSPorId);
router.put("/:id", osController.atualizarOS); // rota para permitir editar somente OSs pendentes
router.put("/:id/status", osController.atualizarStatusOS);
router.get('/:id/pdf', osController.gerarPDFOrdem);

module.exports = router;