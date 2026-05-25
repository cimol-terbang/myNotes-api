import { db } from "../config/db.js"

function parseComment(row) {
  if (!row) return null
  return { ...row }
}

function parseComments(rows) {
  return rows.map(parseComment)
}

const Comment = {
  create({ postId, name, content }) {
    const stmt = db.prepare(`
      INSERT INTO comments (postId, name, content)
      VALUES (?, ?, ?)
    `)
    const info = stmt.run(postId, name, content)
    const row = db
      .prepare("SELECT * FROM comments WHERE id = ?")
      .get(info.lastInsertRowid)
    return parseComment(row)
  },

  find({ postId } = {}, { sort = "createdAt", order = "DESC" } = {}) {
    let query = "SELECT * FROM comments WHERE 1=1"
    const params = []

    if (postId !== undefined) {
      query += " AND postId = ?"
      params.push(postId)
    }

    query += ` ORDER BY ${sort} ${order}`

    const rows = db.prepare(query).all(...params)
    return parseComments(rows)
  },
}

export default Comment
