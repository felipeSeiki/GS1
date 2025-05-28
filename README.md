Sistema de Agendamento de Consultas Médicas

Felipe Seiki Hashiguti - RM: 98985

📱 Sobre o Projeto
Clínica App é um aplicativo mobile desenvolvido em React Native (Expo) + TypeScript, destinado a clínicas médicas. Oferece funcionalidades personalizadas para três tipos de usuários: administrador, médico e paciente, garantindo uma experiência adaptada para cada perfil.

<h2> Principais Funcionalidades </h2>
<h3> Autenticação e Controle de Acesso: </h3>
Login simulado com armazenamento local (AsyncStorage).

Gerenciamento de sessão via AuthContext (contexto de autenticação).

Tipagem de usuários (UserType) para diferenciar permissões:

Admin: Acesso total.

Médico: Visualização de consultas vinculadas.

Paciente: Acesso apenas aos próprios agendamentos.

<h2> Perfil Personalizado </h2> 
Exibição de informações conforme o tipo de usuário:

Admin: Nome e cargo.

Médico: Nome, especialidade e CRM.

Paciente: Nome, idade e histórico médico resumido.

<h2> Gestão de Agendamentos </h2> 
Visualização dinâmica de consultas:

Admin: Todos os agendamentos.

Médico: Apenas suas consultas.

Paciente: Somente seus agendamentos.

Componente reutilizável AgendamentoCard para exibição padronizada.
