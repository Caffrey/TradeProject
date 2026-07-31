
from sqlalchemy import UniqueConstraint

from sqlalchemy.dialects.postgresql import insert

def UpsertAll(session, model, data_list):

    table = model.__table__

    # 自动获取唯一约束
    unique_columns = []

    for constraint in table.constraints:
        if isinstance(constraint, UniqueConstraint):
            unique_columns = [
                col.name for col in constraint.columns
            ]
            break

    if not unique_columns:
        raise Exception(
            "No UniqueConstraint found"
        )


    values = [
        {
            c.name:getattr(item,c.name)
            for c in table.columns
            if c.name != "ID"
        }
        for item in data_list
    ]


    stmt = insert(model).values(values)


    update_columns = {
        c.name: stmt.excluded[c.name]
        for c in table.columns
        if c.name not in unique_columns
        and c.name != "ID"
    }


    stmt = stmt.on_conflict_do_update(
        index_elements=unique_columns,
        set_=update_columns
    )


    session.execute(stmt)
    session.commit()

