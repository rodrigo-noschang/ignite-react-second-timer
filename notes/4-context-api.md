# Context API

Os contextos servem para que possamos compartilhar estados entre componentes que não estão, necessariamente, conectados na árvore DOM, ou seja, que não são pai e filho, nem pai e "neto", ou até mesmo componentes que sejam "irmãos", assim por diante. Sua grande utilidade é evitar o prop drilling e a necessidade de enviar quantidades gigantescas de estados de um componente para outro. 

