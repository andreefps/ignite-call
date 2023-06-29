export function getWeekDays(short = false) {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 10, day))))
    .map((weekDay) => {
      return short
        ? weekDay.substring(0, 3).toUpperCase()
        : weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
