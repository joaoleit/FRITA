import React, { useMemo } from "react";
import { toRem, type RETROSPECTIVE_TYPES } from "../../utils";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  retroType: RETROSPECTIVE_TYPES;
  boardTitle: string;
}

const styles = {
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "0%",
    verticalAlign: "middle",
    color: "#5C5C5C",
  },
  normalText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    verticalAlign: "middle",
    color: "#5C5C5C",
  },
};

const InfoDialog = ({ open, retroType, setOpen, boardTitle }: Props) => {
  const retroInfo = useMemo(() => {
    if (retroType === "easy-as-pie") {
      return <Box></Box>;
    } else if (retroType === "open-the-box") {
      return (
        <Box>
          <Typography sx={styles.normalText}>
            O Open the Box promove a inovação e desafia as atividades atuais
            realizadas pela equipe.
            <br />
            <br />
            <b>Executando a atividade:</b>
            <br />
            <br />
            1) Comece lendo a seguinte citação:
            <br />
            <br />
            “O mundo como o criamos é um processo do nosso pensamento. Ele não
            pode ser mudado sem mudarmos o nosso pensamento.” <br />– Albert
            Einstein.
            <br />
            <br />
            2) Chame a atenção dos participantes para a metáfora da caixa:
            <br />
            <br />
            "Dentro desta caixa estão todas as atividades realizadas pela
            equipe."
            <br />
            <br />
            3) A tela é dividida em três áreas, com uma caixa aberta desenhada
            no centro. Explique cada uma das áreas:
            <br />
            <ul>
              <li>Quais atividades devem ser removidas da caixa?</li>
              <li>Quais atividades devem ser adicionadas? </li>
              <li>Quais temos que reciclar?</li>
            </ul>
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography sx={styles.normalText}>
            Essa retrospectiva é comumente usada para gerar conversas sobre as
            notas positivas, as melhorias e sugestões que a equipe tem em mente.
            <br />
            <br />
            <b>Executando a atividade:</b>
            <br />
            <br />
            1) A tela é dividida em três áreas:
            <br />
            <br />
            <b>Well</b> – coisas que deram certo, que nos impulsionam, nos
            ajudam a melhorar. Queremos repeti-las!
            <br />
            <b>Not so Well</b> – coisas que deram errado, que precisam ser
            melhoradas, que nos impedem. Queremos eliminá-las ou evitá-las!
            <br />
            <b>New ideas</b> – coisas que devemos considerar tentar, sugestões,
            novas ideias.
            <br />
            <br />
            2) Peça aos participantes para adicionar notas a cada uma das três
            áreas.
            <br />
            <br />
            3) Conversas e itens de ação.
          </Typography>
        </Box>
      );
    }
  }, [retroType]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
      <Box sx={{ padding: toRem(32), width: toRem(612) }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={toRem(32)}
        >
          <Typography sx={styles.title}>{boardTitle}</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {retroInfo}
      </Box>
    </Dialog>
  );
};

export default InfoDialog;
