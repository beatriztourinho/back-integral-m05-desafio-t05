const { compareAsc } = require('date-fns')

function compareData(is_paid, deadline) {
  if (!deadline) {
    return 'pendente'
  }

  if (is_paid) {
    return 'paga'
  } else if (!is_paid) {
    if (compareAsc(new Date(deadline), new Date()) === 1) {
      return 'pendente'
    } else if (compareAsc(new Date(deadline), new Date()) === -1) {
      return 'vencida'
    }
  }
}

module.exports = compareData