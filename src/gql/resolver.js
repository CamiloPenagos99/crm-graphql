const cursos = [
    {title: "Aprender NodeJS", topic: "Node", year: 2020},
    {title: "Fundamentos Mongo", topic: "MongoDB", year: 2021},
    {title: "React Avanzado", topic: "React", year: 2019},
    {title: "React y React Native", topic: "React", year: 2021}
  ]
  
  // Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      cursos: (_, props, ctx) => {
        console.log(ctx)
        console.log("gQL input: ", props.input)
        const res = cursos.filter(curso => curso.topic === 'input')
        return res
      },
    },
  };