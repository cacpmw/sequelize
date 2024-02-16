
-- endpoint 6
    select Profiles.profession, sum(Jobs.price)
    from Jobs left join Contracts
    on Jobs.ContractId = Contracts.id
    left join Profiles on Contracts.ClientId = Profiles.id
    where Jobs.paid = 1 and
    Jobs.paymentDate between
    date("2020-08-14") and date("2020-08-18")
    group by Profiles.id, Profiles.profession
    order by sum(Jobs.price) DESC limit 1


-- endpoint 7
select Profiles.id, Profiles.firstName, Profiles.lastName, sum(Jobs.price) as Paid
from Jobs left join Contracts
on Jobs.ContractId = Contracts.id
left join Profiles on Contracts.ClientId = Profiles.id
where Jobs.paid = 1 and
Jobs.paymentDate between
date("2020-08-10") and date("2020-08-18")
group by Profiles.id, Profiles.firstName, Profiles.lastName
order by sum(Jobs.price) DESC